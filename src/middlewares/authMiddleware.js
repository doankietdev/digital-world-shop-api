import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import userModel from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import asyncHandler from '~/utils/asyncHandler'
import { verifyToken } from '~/utils/auth'
import { HEADER_KEYS } from '~/utils/constants'

const authenticate = asyncHandler(async (req, res, next) => {
  const userId = req.headers[HEADER_KEYS.USER_ID]
  const authorization = req.headers[HEADER_KEYS.AUTHORIZATION]
  if (!userId || !authorization?.startsWith('Bearer ')) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED)
  }
  const accessToken = authorization?.split(' ')[1]
  if (!accessToken) throw new ApiError(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED)

  let user = null
  try {
    user = await userModel.findOne({
      _id: userId,
      verified: true,
      blocked: false
    })
    if (!user) throw new ApiError(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED)

    if (!user.accessTokens.includes(accessToken)) {
      await userModel.updateOne(
        { _id: user._id },
        { accessTokens: [], refreshTokens: [] }
      )
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Something happened')
    }

    const decodedUser = verifyToken(accessToken, user.publicKey)
    if (decodedUser.userId !== user?._id.toString()) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED)
    }
    req.user = {
      _id: user._id.toString(),
      email: user.email,
      role: user.role
    }
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new ApiError(StatusCodes.GONE, 'Need to refresh token')
    }
    if (error.name === 'JsonWebTokenError') {
      await userModel.updateOne(
        { _id: userId },
        {
          accessTokens: [],
          refreshTokens: [],
          $addToSet: {
            usedRefreshTokens: user?.refreshTokens
          }
        }
      )
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Something happened')
    }
    throw error
  }
})

const checkPermission = (role) => {
  return asyncHandler(async (req, res, next) => {
    const hasPermission = req.user?.role === role
    if (!hasPermission) throw new ApiError(StatusCodes.FORBIDDEN, 'User has no permissions')
    next()
  })
}

export default {
  authenticate,
  checkPermission
}
