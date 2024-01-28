import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import userRepo from '~/repositories/userRepo'
import ApiError from '~/utils/ApiError'
import {
  verifyPassword,
  generateKeyPairRSA,
  generateToken,
  verifyToken,
  hashPassword
} from '~/auth'
import tokenRepo from '~/repositories/tokenRepo'
import { APP, AUTH } from '~/configs/environment'
import sendMail from '~/utils/sendMail'

const removeNoResponseFields = (user = {}) => {
  const noResponseFields = [
    'password',
    'role',
    'publicKey',
    'privateKey',
    'passwordResetToken',
    'passwordResetExpires',
    'usedRefreshTokens'
  ]
  const nextUser = { ...user }
  noResponseFields.forEach((field) => {
    delete nextUser[field]
  })
  return nextUser
}

const signUp = async ({ firstName, lastName, mobile, email, password }) => {
  const user = await userRepo.findOneByEmail(email)
  if (user) {
    let errorMessage = '"email" is already in use'
    if (user.mobile === mobile) {
      errorMessage = `${errorMessage}. "mobile" are already in use`
    }
    throw new ApiError(StatusCodes.CONFLICT, errorMessage)
  }

  const { publicKey, privateKey } = generateKeyPairRSA()
  try {
    const newUser = await userRepo.createNew({
      firstName,
      lastName,
      mobile,
      email,
      password,
      publicKey,
      privateKey
    })
    if (!newUser) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Sign up failed')
    }
    const responseNewUser = removeNoResponseFields(newUser)
    return responseNewUser
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR)
  }
}

const signIn = async ({ email, password }) => {
  const user = await userRepo.findOneByEmail(email)
  if (!user) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid credentials')
  if (user.isBlocked)
    throw new ApiError(StatusCodes.FORBIDDEN, 'User is blocked')
  const isValidPassword = await verifyPassword(password, user.password)
  if (!isValidPassword)
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid credentials')

  const payload = { userId: user._id, email: user.email }
  const accessToken = generateToken(
    payload,
    user.privateKey,
    AUTH.ACCESS_TOKEN_EXPIRES
  )
  const refreshToken = generateToken(
    payload,
    user.privateKey,
    AUTH.REFRESH_TOKEN_EXPIRES
  )

  const token = await tokenRepo.createNew({
    userId: user._id,
    accessToken,
    refreshToken
  })
  if (!token)
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Something went wrong'
    )

  const responseUser = removeNoResponseFields(user)
  return {
    ...responseUser,
    accessToken,
    refreshToken
  }
}

const handleRefreshToken = async (userId, refreshToken) => {
  try {
    if (!userId && !refreshToken) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Refresh token failed')
    }
    const user = await userRepo.findOneById(userId)
    if (!user)
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Refresh token failed')
    if (user.usedRefreshTokens.includes(refreshToken)) {
      await tokenRepo.deleteByUserId(user?._id)
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Refresh token failed')
    }
    const token = await tokenRepo.findOne({ userId, refreshToken })
    if (!token)
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Refresh token failed')

    verifyToken(refreshToken, user.publicKey)

    const payload = { userId: user._id, email: user.email }
    const newAccessToken = generateToken(
      payload,
      user.privateKey,
      AUTH.ACCESS_TOKEN_EXPIRES
    )
    const newRefreshToken = generateToken(
      payload,
      user.privateKey,
      AUTH.REFRESH_TOKEN_EXPIRES
    )

    await tokenRepo.createNew({
      userId: user?._id,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    })
    await tokenRepo.deleteOne({ userId, refreshToken })

    return { accessToken: newAccessToken, refreshToken: newRefreshToken }
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      await tokenRepo.deleteOne({ userId, refreshToken })
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Expired refresh token')
    }
    if (error.name === 'JsonWebTokenError') {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid refresh token')
    }
    if (error.name === 'ApiError') throw error
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      ReasonPhrases.INTERNAL_SERVER_ERROR
    )
  }
}

const signOut = async (token) => {
  try {
    await tokenRepo.deleteOne({ _id: token?._id })
    await userRepo.pushUsedRefreshToken(token.userId, token.refreshToken)
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Sign out failed')
  }
}

const forgotPassword = async (email) => {
  if (!email) throw new ApiError(StatusCodes.BAD_REQUEST, 'Missing email')
  const user = await userRepo.findOneByEmail(email)
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')

  const passwordResetToken = generateToken(
    {
      userId: user._id,
      email: user.email
    },
    user.privateKey,
    AUTH.PASSWORD_RESET_TOKEN_EXPIRES
  )
  await userRepo.updateById(user?._id, { passwordResetToken })

  const html = `
    Please click on the link below to change your password
    <a href="${APP.PROTOCOL}://${APP.HOST}:${APP.PORT}/api/v1/auth/reset-password/${user._id}/${passwordResetToken}">Click here</a>
  `
  return await sendMail(email, {
    subject: 'Forgot password',
    html
  })
}

const resetPassword = async ({ userId, token, password }) => {
  const user = await userRepo.findOneById(userId)
  if (!user)
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Reset password failed')
  if (user.passwordResetToken !== token) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Reset password failed')
  }
  try {
    verifyToken(token, user.publicKey)
    await userRepo.updateById(user?._id, {
      password: await hashPassword(password),
      passwordChangedAt: Date.now()
    })
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      await userRepo.updateById(user?._id, { passwordResetToken: null })
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Expired token')
    }
    if (error.name === 'JsonWebTokenError') {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid token')
    }
    if (error.name === 'ApiError') throw error
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      ReasonPhrases.INTERNAL_SERVER_ERROR
    )
  }
}

export default {
  signUp,
  signIn,
  signOut,
  handleRefreshToken,
  forgotPassword,
  resetPassword
}
