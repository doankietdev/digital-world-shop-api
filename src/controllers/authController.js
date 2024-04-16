import { StatusCodes } from 'http-status-codes'
import SuccessResponse from '~/utils/SuccessResponse'
import asyncHandler from '~/utils/asyncHandler'
import authService from '~/services/authService'
import { AUTH } from '~/configs/environment'
import { HEADER_KEYS } from '~/utils/constants'

const signUp = asyncHandler(async (req, res) => {
  const user = await authService.signUp(req.body)
  new SuccessResponse({
    statusCode: StatusCodes.CREATED,
    message: `An email has been sent to ${user.email}. Please check your email to verify this email.`,
    metadata: {
      user
    }
  }).send(res)
})

const verifyEmail = asyncHandler(async (req, res) => {
  await authService.verifyEmail(req.params)
  new SuccessResponse({
    statusCode: StatusCodes.CREATED,
    message: 'Email verified successfully'
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
  const newTokenPair = await authService.handleRefreshToken(
    userId,
    refreshToken
  )
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

export default {
  signUp,
  verifyEmail,
  signIn,
  handleRefreshToken,
  signOut
}
