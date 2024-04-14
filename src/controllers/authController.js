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
  const { refreshToken, ...data } = await authService.signIn(req.body)
  res.cookie('refreshToken', refreshToken, {
    maxAge: AUTH.REFRESH_TOKEN_EXPIRES,
    httpOnly: true,
    secure: true
  })
  new SuccessResponse({
    message: 'Sign in successfully',
    metadata: data
  }).send(res)
})

const handleRefreshToken = asyncHandler(async (req, res) => {
  const userId = req.headers[HEADER_KEYS.USER_ID]
  const { refreshToken } = req.cookies
  const newTokenPair = await authService.handleRefreshToken(userId, refreshToken)
  res.cookie('refreshToken', newTokenPair.refreshToken, {
    maxAge: AUTH.REFRESH_TOKEN_EXPIRES,
    httpOnly: true,
    secure: true
  })
  new SuccessResponse({
    message: 'Refresh token successfully',
    metadata: { accessToken: newTokenPair.accessToken }
  }).send(res)
})

const signOut = asyncHandler(async (req, res) => {
  await authService.signOut(req.user._id, req.token)
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true
  })
  new SuccessResponse({
    message: 'Sign out successfully'
  }).send(res)
})

const forgotPassword = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Send your mail. Please check mail',
    metadata: {
      mail: await authService.forgotPassword(req.body.email)
    }
  }).send(res)
})

const resetPassword = asyncHandler(async (req, res) => {
  await authService.resetPassword(req.body)
  new SuccessResponse({
    message: 'Reset password successfully'
  }).send(res)
})

export default {
  signUp,
  signIn,
  handleRefreshToken,
  signOut,
  forgotPassword,
  resetPassword
}
