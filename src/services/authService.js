import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import { TOTP } from 'totp-generator'
import useragent from 'useragent'
import { v4 as uuidv4 } from 'uuid'
import { AUTH, CLIENT } from '~/configs/environment'
import userModel from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import {
  checkExpired,
  checkNewPasswordPolicy,
  generateKeyPairRSA,
  generateToken,
  hash,
  verifyHashed,
  verifyToken
} from '~/utils/auth'
import { formatPlaceHolderUrl } from '~/utils/formatter'
import { sendMailWithHTML } from '~/utils/sendMail'
import cartService from './cartService'
import userService from './userService'

const signUp = async ({ firstName, lastName, mobile, email, password }) => {
  let errorMessages = []
  const [foundUserByEmail, foundUserByMobile] = await Promise.all([
    userModel.findOne({ email }),
    userModel.findOne({ mobile })
  ])
  if (foundUserByEmail) {
    errorMessages = [
      ...errorMessages,
      {
        field: 'email',
        message: 'Email is already in use'
      }
    ]
  }
  if (foundUserByMobile) {
    errorMessages = [
      ...errorMessages,
      {
        field: 'mobile',
        message: 'Phone number is already in use'
      }
    ]
  }
  if (errorMessages.length)
    throw new ApiError(
      StatusCodes.CONFLICT,
      'The information entered is invalid. Please check and try again!',
      { errors: errorMessages }
    )

  const { publicKey, privateKey } = generateKeyPairRSA()
  const { hashed } = await hash(password)

  const verificationToken = uuidv4()
  const newUser = await userModel.create({
    firstName,
    lastName,
    mobile,
    email,
    password: hashed,
    verificationToken,
    publicKey,
    privateKey
  })
  await sendMailWithHTML({
    email,
    subject: 'Verify Account',
    pathToView: 'verify-email.ejs',
    data: {
      url: `${CLIENT.URL}/auth/verify-account?email=${newUser.email}&token=${newUser.verificationToken}`
    }
  })

  await cartService.createNewCart({ userId: newUser._id })

  return {
    email: newUser.email
  }
}

const verifyAccount = async ({ email, token }) => {
  const foundUser = await userModel.findOne({ email })
  if (!foundUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Email not found')

  if (foundUser.verified) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Account has been verified')
  }

  if (foundUser.verificationToken !== token) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Token not found')
  }

  const { modifiedCount } = await userModel.updateOne(
    { _id: foundUser._id },
    { verificationToken: null, verified: true }
  )
  if (!modifiedCount)
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Verify account failed')
  return {
    email
  }
}

const signIn = async ({ email, password, headerUserAgent, ip }) => {
  const user = await userModel.findOne({ email })
  if (!user)
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Incorrect email or password'
    )

  const isValidPassword = await verifyHashed(password, user.password)
  if (!isValidPassword)
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Incorrect email or password'
    )

  if (user.blocked)
    throw new ApiError(StatusCodes.FORBIDDEN, 'Account has been blocked')

  if (!user.verified) {
    let verificationToken = user.verificationToken
    if (!verificationToken) {
      verificationToken = uuidv4()
      user.verificationToken = verificationToken
      await user.save()
    }
    await sendMailWithHTML({
      email,
      subject: 'Verify Account',
      pathToView: 'verify-email.ejs',
      data: {
        url: `${CLIENT.URL}/auth/verify-account?email=${user.email}&token=${verificationToken}`
      }
    })
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      'Account has not been verified. Please check your email and verify account!'
    )
  }

  if (user.sessions.length >= AUTH.MAX_SESSIONS) {
    user.sessions.shift()
  }

  const payload = { userId: user._id, email: user.email }
  const accessToken = generateToken(
    payload,
    user.privateKey,
    AUTH.ACCESS_TOKEN_LIFE
  )
  const refreshToken = generateToken(
    payload,
    user.privateKey,
    AUTH.REFRESH_TOKEN_LIFE
  )

  const agent = useragent.parse(headerUserAgent)

  user.sessions.push({
    accessToken,
    refreshToken,
    device: {
      name: agent.device.toString(),
      deviceType: agent.device.family,
      os: agent.os.toString(),
      browser: agent.toAgent(),
      ip
    }
  })

  await user.save()

  return {
    user: await userService.getUser(user._id),
    accessToken,
    refreshToken
  }
}

const signInStatus = async ({ sessions = [], accessToken }) => {
  const session = sessions.find(session => session.accessToken === accessToken)
  if (!session) throw new ApiError(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED)
  return {
    device: session.device,
    signInTime: session.createdAt
  }
}

const signOut = async ({ userId, ip }) => {
  const user = await userModel.findOne({
    _id: userId,
    'sessions.device.ip': ip
  })
  if (user) {
    user.sessions = user.sessions.filter(session => session.device.ip !== ip)
    await user.save()
  }
}

const forgotPassword = async ({ email }) => {
  const foundUser = await userModel.findOne({ email })
  if (!foundUser)
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Sorry, email you entered is not associated with any account. Please check your email and try again!')

  const expiresAt = Date.now() + AUTH.PASSWORD_RESET_OTP_LIFE

  const { otp } = TOTP.generate(AUTH.PASSWORD_RESET_OTP_SECRET_KEY, {
    algorithm: 'SHA3-512',
    timestamp: expiresAt
  })

  await userModel.updateOne(
    { _id: foundUser._id },
    {
      passwordResetOTP: {
        otp: (await hash(otp)).hashed,
        expiresAt
      }
    }
  )

  await sendMailWithHTML({
    email,
    subject: 'Reset Password',
    pathToView: 'password-reset-otp.ejs',
    data: {
      otp,
      otpFormUrl:
          CLIENT.URL +
          formatPlaceHolderUrl(CLIENT.CLIENT_OTP_FORM_PATH, {
            userId: foundUser?._id,
            email
          }),
      firstName: foundUser.firstName
    }
  })

  return {
    email,
    expiresAt
  }
}

const verifyPasswordResetOtp = async ({ email, otp }) => {
  const foundUser = await userModel.findOne({ email })
  if (!foundUser)
    throw new ApiError(StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST)

  if (!foundUser.passwordResetOTP) {
    throw new ApiError(StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST)
  }

  const { otp: hashedOTP, expiresAt } = foundUser.passwordResetOTP
  if (checkExpired(expiresAt))
    throw new ApiError(StatusCodes.GONE, 'Expired OTP. Please press OTP resend button!')
  const isCorrect = await verifyHashed(otp, hashedOTP)
  if (!isCorrect) throw new ApiError(StatusCodes.BAD_REQUEST, 'Incorrect OTP')

  const token = generateToken(
    {
      userId: foundUser._id,
      email: foundUser.email
    },
    foundUser.privateKey,
    Math.floor(AUTH.PASSWORD_RESET_TOKEN_LIFE / 1000)
  )

  await userModel.updateOne(
    { _id: foundUser },
    {
      passwordResetOTP: null,
      passwordResetToken: {
        token,
        expiresAt: Date.now() + AUTH.PASSWORD_RESET_TOKEN_LIFE
      }
    }
  )

  return { email, token }
}

const resetPassword = async ({ email, token, newPassword }) => {
  if (!token) throw new ApiError(StatusCodes.BAD_REQUEST, 'Missing token')
  const foundUser = await userModel.findOne({ email })
  if (!foundUser)
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Email is not associated with any account')
  if (foundUser.passwordResetToken?.token !== token)
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid token')

  try {
    const decodedUser = verifyToken(token, foundUser.publicKey)
    if (
      foundUser._id.toString() !== decodedUser.userId ||
      decodedUser.email !== foundUser.email
    ) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid token')
    }

    const { isValid, message } = await checkNewPasswordPolicy(
      newPassword,
      foundUser.passwordHistory,
      foundUser.password
    )
    if (!isValid) throw new ApiError(StatusCodes.CONFLICT, message)

    // reset password
    const { modifiedCount } = await userModel.updateOne(
      { _id: foundUser._id },
      {
        password: (await hash(newPassword)).hashed,
        sessions: [],
        $addToSet: {
          'passwordHistory': {
            password: foundUser.password
          }
        },
        passwordResetToken: null
      }
    )
    if (modifiedCount === 0) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Reset password failed')
    }
  } catch (error) {
    if (error.name === 'TokenExpiredError')
      throw new ApiError(StatusCodes.GONE, 'Password reset deadline has expired. Please try again!')
    if (error.name === 'JsonWebTokenError')
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid token')
    throw error
  }
}

const refreshToken = async ({ userId, refreshToken }) => {
  if (!userId || !refreshToken)
    throw new ApiError(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED)

  const user = await userModel.findOne({
    _id: userId
  })
  if (!user)
    throw new ApiError(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED)

  if (user.usedRefreshTokens?.includes(refreshToken)) {
    user.sessions = []
    await user.save()
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Something happened')
  }

  const session = user.sessions?.find(session => session.refreshToken === refreshToken)
  if (!session)
    throw new ApiError(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED)

  try {
    const decodedUser = verifyToken(refreshToken, user.publicKey)

    const payload = {
      userId: decodedUser.userId,
      email: decodedUser.email
    }
    const newAccessToken = generateToken(
      payload,
      user.privateKey,
      AUTH.ACCESS_TOKEN_LIFE
    )

    session.accessToken = newAccessToken
    await user.save()

    return {
      accessToken: newAccessToken
    }
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      user.usedRefreshTokens.push(refreshToken)
      await user.save()
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Expired refresh token')
    }
    if (error.name === 'JsonWebTokenError') {
      user.sessions = []
      user.usedRefreshTokens.push(refreshToken)
      await user.save()
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Something happened')
    }
    throw error
  }
}

export default {
  signUp,
  signIn,
  signInStatus,
  signOut,
  verifyAccount,
  forgotPassword,
  verifyPasswordResetOtp,
  resetPassword,
  refreshToken
}
