import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import otpGenerator from 'otp-generator'
import { v4 as uuidv4 } from 'uuid'
import { AUTH, BUILD_MODE, CLIENT } from '~/configs/environment'
import emailTokenModel from '~/models/emailTokenModel'
import passwordHistoryModel from '~/models/passwordHistoryModel'
import passwordResetOtpModel from '~/models/passwordResetOtpModel'
import passwordResetTokenModel from '~/models/passwordResetTokenModel'
import userModel from '~/models/userModel'
import googleOAuthProvider from '~/providers/googleOAuthProvider'
import ApiError from '~/utils/ApiError'
import {
  checkExpired,
  checkNewPasswordPolicy,
  generateBase64Token,
  generateKeyPairRSA,
  generateToken,
  hash,
  verifyHashed,
  verifyToken
} from '~/utils/auth'
import { formatPlaceHolderUrl } from '~/utils/formatter'
import { sendMailWithHTML } from '~/utils/sendMail'
import cartService from './cartService'
import loginSessionService from './loginSessionService'
import userService from './userService'
import usedRefreshTokenService from './usedRefreshTokenService'
import { DEV_ENV } from '~/utils/constants'

/**
 * Create auth token pair
 * @param {{ userId: string, email: string, agent: object }} data
 */
const createAuthTokenPair = async (data = {}) => {
  const { userId, email, agent } = data

  const { publicKey, privateKey } = generateKeyPairRSA()

  const payload = { userId, email }
  const accessToken = generateToken(
    payload,
    privateKey,
    AUTH.ACCESS_TOKEN_LIFE
  )
  const refreshToken = generateToken(
    payload,
    privateKey,
    AUTH.REFRESH_TOKEN_LIFE
  )

  await loginSessionService.createNew({
    ...agent,
    userId,
    publicKey
  })

  return { accessToken, refreshToken }
}

const signUp = async ({ firstName, lastName, email, password }) => {
  let errorMessages = []
  const foundUserByEmail = await userModel.findOne({ email })
  if (foundUserByEmail) {
    errorMessages = [
      ...errorMessages,
      {
        field: 'email',
        message: 'Email is already in use'
      }
    ]
  }
  if (errorMessages.length)
    throw new ApiError(
      StatusCodes.CONFLICT,
      'The information entered is invalid. Please check and try again!',
      { errors: errorMessages }
    )

  const { hashed } = await hash(password)

  const newUser = await userModel.create({
    firstName,
    lastName,
    email,
    password: hashed
  })

  const token = uuidv4()
  await emailTokenModel.findOneAndUpdate(
    { userId: newUser._id },
    { code: (await hash(token)).hashed, expiresAt: Date.now() + AUTH.EMAIL_VERIFICATION_TOKEN_LIFE },
    { upsert: true, new: true }
  )

  sendMailWithHTML({
    email,
    subject: 'Verify Account',
    pathToView: 'verify-email.ejs',
    data: {
      url: `${CLIENT.URL}/auth/verify-account?email=${newUser.email}&token=${token}`
    }
  })

  await cartService.createNewCart({ userId: newUser._id })

  if (BUILD_MODE === DEV_ENV) {
    return {
      email: newUser.email,
      token
    }
  }

  return {
    email: newUser.email
  }
}

const verifyAccount = async ({ email, token }) => {
  const foundUser = await userModel.findOne({ email }).lean()
  if (!foundUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Email not found')

  const foundEmailToken = await emailTokenModel.findOne({ userId: foundUser._id })
  if (!foundEmailToken) throw new ApiError(StatusCodes.NOT_FOUND, 'Token not found')

  const isMatch = await verifyHashed(token, foundEmailToken.code)
  if (!isMatch) throw new ApiError(StatusCodes.NOT_FOUND, 'Invalid token')

  const { modifiedCount } = await userModel.updateOne(
    { _id: foundUser._id },
    { verified: true }
  )
  if (!modifiedCount)
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Verify account failed')

  await emailTokenModel.deleteMany({ userId: foundUser._id })

  return {
    email
  }
}

const signIn = async ({ email, password, agent }) => {
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

  const { accessToken, refreshToken } = await createAuthTokenPair({
    userId: user._id.toString(),
    email: user.email,
    agent
  })

  return {
    user: await userService.getUser(user._id),
    accessToken,
    refreshToken
  }
}

const signInWithGoogle = async ({
  code,
  agent
}) => {
  const {
    sub,
    given_name,
    family_name,
    email,
    picture
  } = await googleOAuthProvider.getProfile(code)

  const foundUserWithGoogleId = await userModel.findOne({ googleId: sub })
  if (foundUserWithGoogleId) {
    if (foundUserWithGoogleId.blocked)
      throw new ApiError(StatusCodes.FORBIDDEN, 'Account has been blocked')

    const { accessToken, refreshToken } = await createAuthTokenPair({
      userId: foundUserWithGoogleId._id.toString(),
      email: foundUserWithGoogleId.email,
      agent
    })

    return {
      user: await userService.getUser(foundUserWithGoogleId._id),
      accessToken,
      refreshToken
    }
  }

  const foundUserWithEmail = await userModel.findOne({ email })
  if (foundUserWithEmail?.email === email) throw new ApiError(StatusCodes.CONFLICT, 'This email was used to register the account')

  const newUser = await userModel.create({
    googleId: sub,
    firstName: given_name,
    lastName: family_name,
    email,
    image: { url: picture },
    verified: true
  })
  await cartService.createNewCart({ userId: newUser._id })

  const { accessToken, refreshToken } = await createAuthTokenPair({
    userId: newUser._id.toString(),
    email: newUser.email,
    agent
  })

  return {
    user: await userService.getUser(newUser._id),
    accessToken,
    refreshToken
  }
}


const signOut = async ({ loginSessionId }) => {
  await loginSessionService.deleteById(loginSessionId)
}

const forgotPassword = async ({ email }) => {
  const foundUser = await userModel.findOne({ email })
  if (!foundUser)
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Sorry, email you entered is not associated with any account. Please check your email and try again!')

  const otp = otpGenerator.generate(6, {
    digits: true,
    lowerCaseAlphabets: false,
    specialChars: false,
    upperCaseAlphabets: false
  })

  const newPasswordResetOTP = await passwordResetOtpModel.findOneAndUpdate(
    {
      userId: foundUser._id
    },
    {
      code: (await hash(otp)).hashed,
      expiresAt: Date.now() + AUTH.PASSWORD_RESET_OTP_LIFE
    },
    {
      upsert: true,
      new: true
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
    expiresAt: new Date(newPasswordResetOTP.expiresAt).getTime()
  }
}

const verifyPasswordResetOtp = async ({ email, otp }) => {
  const foundUser = await userModel.findOne({ email })
  if (!foundUser)
    throw new ApiError(StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST)

  const foundPasswordResetOtp = await passwordResetOtpModel.findOne({ userId: foundUser._id })
  if (!foundPasswordResetOtp) throw new ApiError(StatusCodes.NOT_FOUND, 'OTP not found')

  const { code: hashedOTP, expiresAt } = foundPasswordResetOtp
  if (checkExpired(expiresAt))
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Expired OTP. Please press OTP resend button!')
  const isCorrect = await verifyHashed(otp, hashedOTP)
  if (!isCorrect) throw new ApiError(StatusCodes.BAD_REQUEST, 'Incorrect OTP')

  await passwordResetOtpModel.deleteMany({ userId: foundUser._id })

  const token = generateBase64Token()
  const newPasswordResetToken = await passwordResetTokenModel.findOneAndUpdate(
    { userId: foundUser._id },
    { code: (await hash(token)).hashed, expiresAt: Date.now() + AUTH.PASSWORD_RESET_TOKEN_LIFE },
    { upsert: true, new: true }
  )

  await passwordHistoryModel.deleteMany({ userId: foundUser._id })

  return { email, token, expiresAt: new Date(newPasswordResetToken.expiresAt).getTime() }
}

const resetPassword = async ({ email, token, newPassword }) => {
  if (!token) throw new ApiError(StatusCodes.BAD_REQUEST, 'Missing token')
  const foundUser = await userModel.findOne({ email })
  if (!foundUser)
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Email is not associated with any account')

  const foundPasswordResetToken = await passwordResetTokenModel.findOne({ userId: foundUser._id }).lean()
  if (!foundPasswordResetToken) throw new ApiError(StatusCodes.BAD_REQUEST, 'Password reset time has expired. Please try again')

  const isMatch = await verifyHashed(token, foundPasswordResetToken.code)
  if (!isMatch) throw new ApiError(StatusCodes.BAD_REQUEST, 'Password reset time has expired. Please try again')

  const passwordHistory = await passwordHistoryModel.find({ userId: foundUser._id })
  const { isValid, message } = await checkNewPasswordPolicy(
    newPassword,
    passwordHistory,
    foundUser.password
  )
  if (!isValid) throw new ApiError(StatusCodes.CONFLICT, message)

  // reset password
  const { modifiedCount } = await userModel.updateOne(
    { _id: foundUser._id },
    {
      password: (await hash(newPassword)).hashed,
      sessions: []
    }
  )
  if (modifiedCount === 0) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Reset password failed')
  }

  await passwordHistoryModel.create({
    userId: foundUser._id,
    password: foundUser.password
  })
}

const refreshToken = async ({ userId, refreshToken, agent }) => {
  if (!userId || !refreshToken)
    throw new ApiError(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED)

  const [foundUsedRefreshToken, foundLoginSession] = await Promise.all([
    usedRefreshTokenService.getOne({
      userId,
      code: refreshToken
    }),
    loginSessionService.getOne({
      userId,
      ip: agent?.ip,
      browserName: agent?.browser?.name,
      osName: agent?.os?.name
    })
  ])

  if (foundUsedRefreshToken || !foundLoginSession) {
    await loginSessionService.deleteManyByUserId(userId)
    throw new Error('Users using blacklisted tokens or abnormal IP')
  }

  try {
    const decodedUser = verifyToken(refreshToken, foundLoginSession.publicKey)

    const foundUser = await userModel.findOne({ _id: decodedUser.userId })
    if (!foundUser) throw new Error('User not found')

    if (foundUser.blocked) throw new Error('Account has been blocked')
    if (!foundUser.verified) throw new Error('Account has not been verified')
    await loginSessionService.deleteById(foundLoginSession._id)

    await usedRefreshTokenService.add({ userId, code: refreshToken })

    return await createAuthTokenPair({
      userId: foundUser._id.toString(),
      email: foundUser.email,
      agent
    })
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      await usedRefreshTokenService.add({ userId, code: refreshToken })
      await loginSessionService.deleteById(foundLoginSession._id)
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Expired refresh token')
    }
    throw error
  }
}

export default {
  signUp,
  signIn,
  signInWithGoogle,
  signOut,
  verifyAccount,
  forgotPassword,
  verifyPasswordResetOtp,
  resetPassword,
  refreshToken
}
