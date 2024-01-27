import { StatusCodes } from 'http-status-codes'
import SuccessResponse from '~/utils/SuccessResponse'
import asyncHandler from '~/utils/asyncHandler'
import authService from '~/services/authService'
import { AUTH } from '~/configs/environment'
import { HEADER_KEYS } from '~/utils/constants'

const signUp = asyncHandler(async (req, res) => {
  new SuccessResponse({
    statusCode: StatusCodes.CREATED,
    message: 'Sign up successfully',
    metadata: {
      user: await authService.signUp(req.body)
    }
  }).send(res)
})

const signIn = asyncHandler(async (req, res) => {
  const { refreshToken, ...user } = await authService.signIn(req.body)

  res.cookie('refreshToken', refreshToken, {
    maxAge: AUTH.REFRESH_TOKEN_EXPIRES,
    httpOnly: true,
    secure: true
  })

  new SuccessResponse({
    message: 'Sign in successfully',
    metadata: {
      user
    }
  }).send(res)
})

const refreshToken = asyncHandler(async (req, res) => {
  const userId = req.headers[HEADER_KEYS.USER_ID]
  const { accessToken, refreshToken } = await authService.refreshToken(userId, req.cookies.refreshToken)

  res.cookie('refreshToken', refreshToken, {
    maxAge: AUTH.REFRESH_TOKEN_EXPIRES,
    httpOnly: true,
    secure: true
  })

  new SuccessResponse({
    message: 'Refresh token successfully',
    metadata: { accessToken }
  }).send(res)
})

const signOut = asyncHandler(async (req, res) => {
  await authService.signOut(req.token)
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true
  })
  new SuccessResponse({
    message: 'Sign out successfully'
  }).send(res)
})

export default {
  signUp,
  signIn,
  refreshToken,
  signOut
}