import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import { verifyToken } from '~/auth'
import tokenRepo from '~/repositories/tokenRepo'
import userRepo from '~/repositories/userRepo'
import ApiError from '~/utils/ApiError'
import asyncHandler from '~/utils/asyncHandler'
import { HEADER_KEYS } from '~/utils/constants'

const authenticate = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.headers[HEADER_KEYS.USER_ID]
    const authorization = req.headers[HEADER_KEYS.AUTHORIZATION]

    if (!userId && !authorization?.includes('Bearer')) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED)
    }
    const accessToken = authorization?.split(' ')[1]
    if (!accessToken) throw new ApiError(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED)

    const user = await userRepo.findOneById(userId)
    if (!user) throw new ApiError(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED)

    const token = await tokenRepo.findOne({ userId: user?._id, accessToken })
    if (!token) throw new ApiError(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED)

    const decodedUser = verifyToken(accessToken, user.publicKey)
    if (decodedUser.userId !== user?._id.toString()) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED)
    }
    req.decodedUser = decodedUser
    req.token = token
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Expired access token')
    }
    if (error.name === 'JsonWebTokenError') {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid access token')
    }
    if (error.name === 'ApiError') throw error
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR)
  }
})

export default {
  authenticate
}
