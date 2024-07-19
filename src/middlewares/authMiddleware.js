import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import userModel from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import asyncHandler from '~/utils/asyncHandler'
import { verifyToken } from '~/utils/auth'
import { HEADER_KEYS } from '~/utils/constants'

const authenticate = asyncHandler(async (req, res, next) => {
  const userId = req.headers[HEADER_KEYS.USER_ID]
  const accessToken = req.headers[HEADER_KEYS.AUTHORIZATION]?.substring('Bearer '.length)
  if (!userId || !accessToken) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED)
  }

  const user = await userModel.findOne({
    _id: userId,
    verified: true,
    blocked: false,
    'sessions.accessToken': accessToken,
    'sessions.device.ip': req.ip
  })
  if (!user) throw new ApiError(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED)

  try {
    const decodedUser = verifyToken(accessToken, user.publicKey)
    if (decodedUser.userId !== user?._id?.toString()) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED)
    }
    req.user = user
    req.accessToken = accessToken
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new ApiError(StatusCodes.GONE, 'Need to refresh token', {
        accessToken
      })
    }
    throw new ApiError(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED)
  }
})

const checkPermission = (role) => {
  return asyncHandler(async (req, res, next) => {
    const hasPermission = req.user?.role === role
    if (!hasPermission) throw new ApiError(StatusCodes.FORBIDDEN, 'Account has no permissions')
    next()
  })
}

export default {
  authenticate,
  checkPermission
}
