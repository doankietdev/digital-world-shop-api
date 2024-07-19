import { StatusCodes } from 'http-status-codes'
import ms from 'ms'
import { AUTH } from '~/configs/environment'
import authService from '~/services/authService'
import SuccessResponse from '~/utils/SuccessResponse'
import asyncHandler from '~/utils/asyncHandler'
import { HEADER_KEYS } from '~/utils/constants'

const signUp = asyncHandler(async (req, res) => {
  const { email } = await authService.signUp(req.body)
  new SuccessResponse({
    statusCode: StatusCodes.CREATED,
    message: `An email has been sent to ${email}. Please check and verify your account before sign in!`,
    metadata: {
      email
    }
  }).send(res)
})

const verifyAccount = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Account verified successfully! Now you can sign in to buy our products! Have a good day!',
    metadata: await authService.verifyAccount(req.body)
  }).send(res)
})

const signIn = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Sign in successfully',
    metadata: await authService.signIn({
      ...req.body,
      headerUserAgent: req.headers['user-agent'],
      ip: req.ip
    })
  }).send(res)
})

const signInStatus = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Signed in',
    metadata: await authService.signInStatus({
      accessToken: req.accessToken,
      sessions: req.user.sessions
    })
  }).send(res)
})

const signOut = asyncHandler(async (req, res) => {
  await authService.signOut({
    userId: req.headers[HEADER_KEYS.USER_ID],
    ip: req.ip
  })
  new SuccessResponse({
    message: 'Sign out successfully'
  }).send(res)
})

const forgotPassword = asyncHandler(async (req, res) => {
  const { email, expiresAt } = await authService.forgotPassword(req.body)
  new SuccessResponse({
    message: `An email has been sent to ${email}. Please check your email to enter OTP!`,
    metadata: { email, expiresAt }
  }).send(res)
})

const verifyPasswordResetOtp = asyncHandler(async (req, res) => {
  const { token, email } = await authService.verifyPasswordResetOtp(req.body)

  res.cookie('password_reset_token', token, {
    maxAge: AUTH.PASSWORD_RESET_TOKEN_LIFE + ms('1h'),
    httpOnly: true,
    secure: true
  })

  new SuccessResponse({
    message: 'Valid OTP. Please set a new password!',
    metadata: { email }
  }).send(res)
})

const resetPassword = asyncHandler(async (req, res) => {
  const { password_reset_token } = req.cookies

  await authService.resetPassword({
    ...req.body,
    token: password_reset_token
  })

  res.clearCookie('password_reset_token', {
    httpOnly: true,
    secure: true
  })

  new SuccessResponse({
    message: 'Reset password successfully'
  }).send(res)
})

const refreshToken = asyncHandler(async (req, res) => {
  const userId = req.headers[HEADER_KEYS.USER_ID]
  new SuccessResponse({
    message: 'Refresh token successfully',
    metadata: await authService.refreshToken({
      userId,
      refreshToken: req.body.refreshToken
    })
  }).send(res)
})

export default {
  signUp,
  verifyAccount,
  signIn,
  signInStatus,
  signOut,
  forgotPassword,
  verifyPasswordResetOtp,
  resetPassword,
  refreshToken
}
