import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import userRepo from '~/repositories/userRepo'
import ApiError from '~/utils/ApiError'
import { verifyPassword, generateKeyPairRSA, generateTokenPair, verifyToken } from '~/auth'
import tokenRepo from '~/repositories/tokenRepo'

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
  noResponseFields.forEach(field => {
    delete nextUser[field]
  })
  return nextUser
}

const signUp = async (reqBody = {}) => {
  const user = await userRepo.findOneByEmail(reqBody.email)
  if (user) throw new ApiError(StatusCodes.CONFLICT, 'User already exists')

  const { publicKey, privateKey } = generateKeyPairRSA()
  const newUser = await userRepo.createNew({
    ...reqBody,
    publicKey,
    privateKey
  })
  if (!newUser) throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Sign up failed')

  const responseNewUser = removeNoResponseFields(newUser)
  return responseNewUser
}

const signIn = async (reqBody = {}) => {
  const user = await userRepo.findOneByEmail(reqBody.email)
  if (!user) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid credentials')
  const isValidPassword = await verifyPassword(reqBody.password, user.password)
  if (!isValidPassword) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid credentials')

  const { accessToken, refreshToken } = generateTokenPair({
    userId: user._id,
    email: user.email
  }, user.privateKey)

  const token = await tokenRepo.createNew({
    userId: user._id,
    accessToken,
    refreshToken
  })
  if (!token) throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong')

  const responseUser = removeNoResponseFields(user)
  return {
    ...responseUser,
    accessToken,
    refreshToken
  }
}

const refreshToken = async (userId, refreshToken) => {
  try {
    if (!userId && !refreshToken) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Refresh token failed')
    }
    const user = await userRepo.findOneById(userId)
    if (!user) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Refresh token failed')
    if (user.usedRefreshTokens.includes(refreshToken)) {
      await tokenRepo.deleteByUserId(user?._id)
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Refresh token failed')
    }
    const token = await tokenRepo.findOne({ userId, refreshToken })
    if (!token) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Refresh token failed')

    verifyToken(refreshToken, user.publicKey)
    const newTokenPair = generateTokenPair({
      userId: user._id, email: user.email
    }, user.privateKey)
    await tokenRepo.createNew({
      userId: user?._id,
      accessToken: newTokenPair.accessToken,
      refreshToken: newTokenPair.refreshToken
    })
    await tokenRepo.deleteOne({ userId, refreshToken })
    return {
      accessToken: newTokenPair.accessToken,
      refreshToken: newTokenPair.refreshToken
    }
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      await tokenRepo.deleteOne({ userId, refreshToken })
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Expired refresh token')
    }
    if (error.name === 'JsonWebTokenError') {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid refresh token')
    }
    if (error.name === 'ApiError') throw error
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR)
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

export default {
  signUp,
  signIn,
  signOut,
  refreshToken
}
