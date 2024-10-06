import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import userModel from '~/models/userModel'
import loginSessionService from '~/services/loginSessionService'
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

  try {

    const foundLoginSession = await loginSessionService.getOne({
      userId,
      ip: req?.agent?.ip,
      browserName: req?.agent?.browser?.name,
      osName: req?.agent?.os?.name
    })
    if (!foundLoginSession) throw new Error('Login session not found')

    const decodedUser = verifyToken(accessToken, foundLoginSession.publicKey)

    const foundUser = await userModel.findOne({ _id: decodedUser.userId })
    if (!foundUser) throw new Error('User not found')
    if (foundUser.blocked) throw new Error('Account has been blocked')
    if (!foundUser.verified) throw new Error('Account has not been verified')

    req.user = foundUser
    req.loginSession = foundLoginSession

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
