import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import { TOTP } from 'totp-generator'
import { AUTH, CLIENT } from '~/configs/environment'
import userModel from '~/models/userModel'
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
        message: 'is already in use'
      }
    ]
  }
  if (foundUserByMobile) {
    errorMessages = [
      ...errorMessages,
      {
        field: 'mobile',
        message: 'is already in use'
      }
    ]
  }
  if (errorMessages.length) {
    throw new ApiError(StatusCodes.CONFLICT, errorMessages)
  }

  const { publicKey, privateKey } = generateKeyPairRSA()
  const { hashed } = await hash(password)

  const token = generateBase64Token()
  const newUser = await userModel.create({
    firstName,
    lastName,
    mobile,
    email,
    password: hashed,
    verificationToken: {
      token, expiresAt: Date.now() + AUTH.EMAIL_VERIFICATION_TOKEN_LIFE
    },
    publicKey,
    privateKey
  })
  await sendMailWithHTML({
    email,
    subject: 'Please confirm your email',
    pathToView: 'verify-email.ejs',
    data: {
      url: `${CLIENT.URL}/auth/verify-email/${newUser._id}/${token}`
    }
  })

  await cartService.createNewCart({ userId: newUser._id })

  return {
    email: newUser.email
  }
}

const verifyEmail = async ({ email, token }) => {
  const foundUser = await userModel.findOne({ email })
  if (!foundUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Email not found')

  if (foundUser.verified) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Account has been verified')
  }

  if (foundUser.verificationToken?.token !== token) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Token not found')
  }

  if (checkExpired(foundUser.verificationToken.expiresAt)) {
    await userModel.updateOne(
      { _id: foundUser._id },
      { verificationToken: null }
    )
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Token has expired')
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

const signIn = async ({ email, password }) => {
  const foundUser = await userModel.findOne({ email })
  if (!foundUser)
    throw new ApiError(
      StatusCodes.UNAUTHORIZED,
      'Incorrect email or password'
    )
  if (foundUser.blocked)
    throw new ApiError(StatusCodes.FORBIDDEN, 'Account has been blocked')

  if (!foundUser.verified) {
    const token = generateBase64Token()
    const newUser = await userModel.updateOne(
      { _id: foundUser._id },
      {
        verificationToken: {
          token, expiresAt: Date.now() + AUTH.EMAIL_VERIFICATION_TOKEN_LIFE
        }
      }
    )
    await sendMailWithHTML({
      email,
      subject: 'Please confirm your email',
      pathToView: 'verify-email.ejs',
      data: {
        url: `${CLIENT.URL}/auth/verify-email/${newUser._id}/${token}`
      }
    })
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      'Account has not been verified. Please check your email and verify account!'
    )
  }

  const isValidPassword = await verifyHashed(password, foundUser.password)
  if (!isValidPassword)
    throw new ApiError(
      StatusCodes.UNAUTHORIZED,
      'Incorrect email or password'
    )

  const payload = { userId: foundUser._id, email: foundUser.email }
  const accessToken = generateToken(
    payload,
    foundUser.privateKey,
    AUTH.ACCESS_TOKEN_LIFE
  )
  const refreshToken = generateToken(
    payload,
    foundUser.privateKey,
    AUTH.REFRESH_TOKEN_LIFE
  )

  await userModel.updateOne(
    { _id: foundUser._id },
    {
      $addToSet: {
        accessTokens: accessToken,
        refreshTokens: refreshToken
      }
    }
  )

  return {
    user: await userService.getUser(foundUser._id),
    accessToken,
    refreshToken
  }
}

const forgotPassword = async ({ email }) => {
  const foundUser = await userModel.findOne({ email })
  if (!foundUser)
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Incorrect email')

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
    throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found')

  const { otp: hashedOTP, expiresAt } = foundUser.passwordResetOTP
  if (checkExpired(expiresAt))
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Expired OTP')
  const isCorrect = await verifyHashed(otp, hashedOTP)
  if (!isCorrect) throw new ApiError(StatusCodes.BAD_REQUEST, 'Incorrect OTP')

  await userModel.updateOne(
    { _id: foundUser },
    { passwordResetOTP: null }
  )

  const token = generateToken(
    {
      userId: foundUser._id,
      email: foundUser.email
    },
    foundUser.privateKey,
    AUTH.PASSWORD_RESET_TOKEN_LIFE
  )

  return { email, token }
}

const resetPassword = async ({ email, token, newPassword }) => {
  if (!token) throw new ApiError(StatusCodes.BAD_REQUEST, 'Token not found')
  const foundUser = await userModel.findOne({ email })
  if (!foundUser)
    throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found')

  const decodedUser = verifyToken(token, foundUser.publicKey)
  if (
    foundUser._id.toString() !== decodedUser.userId ||
      decodedUser.email !== foundUser.email
  ) {
    throw new ApiError(StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST)
  }

  if (!await checkNewPasswordPolicy(newPassword, foundUser.passwordHistory)) {
    const numberDays =
          AUTH.NEW_PASSWORD_NOT_SAME_OLD_PASSWORD_TIME / (1000 * 60 * 60 * 24)
    throw new ApiError(
      StatusCodes.CONFLICT,
      `New password must not be the same as old password for ${numberDays} days`
    )
  }

  // reset password
  const { modifiedCount } = await userModel.updateOne(
    { _id: foundUser._id },
    {
      password: (await hash(newPassword)).hashed,
      accessTokens: [],
      refreshTokens: [],
      $addToSet: {
        'passwordHistory': {
          password: foundUser.password
        }
      }
    }
  )
  if (modifiedCount === 0) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Change password failed')
  }
}

const refreshToken = async ({ userId, accessToken, refreshToken }) => {
  let foundUser = null
  try {
    if (!userId)
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Missing parameters')
    foundUser = await userModel.findOne({ _id: userId })
    if (!foundUser)
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')

    if (
      foundUser.usedRefreshTokens.includes(refreshToken) ||
      !foundUser.accessTokens.includes(accessToken) ||
      !foundUser.refreshTokens.includes(refreshToken)
    ) {
      await userModel.updateOne(
        { _id: userId },
        {
          accessTokens: [],
          refreshTokens: [],
          $addToSet: {
            usedRefreshTokens: foundUser?.refreshTokens
          }
        }
      )
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Something happened')
    }

    const decodedUser = verifyToken(refreshToken, foundUser.publicKey)

    const payload = {
      userId: decodedUser.userId,
      email: decodedUser.email
    }
    const newAccessToken = generateToken(
      payload,
      foundUser.privateKey,
      AUTH.ACCESS_TOKEN_LIFE
    )
    const newRefreshToken = generateToken(
      payload,
      foundUser.privateKey,
      AUTH.REFRESH_TOKEN_LIFE
    )

    await userModel.updateOne(
      { _id: foundUser._id },
      {
        $pull: {
          accessTokens: accessToken,
          refreshTokens: refreshToken
        }
      }
    )
    await userModel.updateOne(
      { _id: foundUser._id },
      {
        $addToSet: {
          usedRefreshTokens: refreshToken,
          accessTokens: newAccessToken,
          refreshTokens: newRefreshToken
        }
      }
    )

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    }
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Expired refresh token')
    }
    if (error.name === 'JsonWebTokenError') {
      await userModel.updateOne(
        { _id: userId },
        {
          accessTokens: [],
          refreshTokens: [],
          $addToSet: {
            usedRefreshTokens: foundUser?.refreshTokens
          }
        }
      )
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Something happened')
    }
    throw error
  }
}

export default {
  signUp,
  signIn,
  verifyEmail,
  forgotPassword,
  verifyPasswordResetOtp,
  resetPassword,
  refreshToken
}
