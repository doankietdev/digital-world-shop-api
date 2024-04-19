import { StatusCodes } from 'http-status-codes'
import { AUTH } from '~/configs/environment'
import authService from '~/services/authService'
import SuccessResponse from '~/utils/SuccessResponse'
import asyncHandler from '~/utils/asyncHandler'
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
  await authService.verifyEmail(req.body)
  new SuccessResponse({
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

const forgotPassword = asyncHandler(async (req, res) => {
  const { userId, email } = await authService.forgotPassword(req.body)

  res.cookie('userId', userId, {
    maxAge: AUTH.PASSWORD_RESET_OTP_TIME,
    httpOnly: true,
    secure: true
  })
  res.cookie('email', email, {
    maxAge: AUTH.PASSWORD_RESET_OTP_TIME,
    httpOnly: true,
    secure: true
  })

  new SuccessResponse({
    message: `An email has been sent to <<${email}>>. Please check your email to enter OTP`
  }).send(res)
})

const verifyPasswordResetOtp = asyncHandler(async (req, res) => {
  const { userId, email } = req.cookies

  const { token } = await authService.verifyPasswordResetOtp({
    ...req.body,
    userId,
    email
  })

  res.cookie('passwordResetToken', token, {
    maxAge: AUTH.PASSWORD_RESET_OTP_TIME,
    httpOnly: true,
    secure: true
  })

  new SuccessResponse({
    message: 'Valid OTP'
  }).send(res)
})

const resendPasswordResetOtp = asyncHandler(async (req, res) => {
  const { userId, email } = await authService.forgotPassword({
    email: req.cookies.email
  })

  res.cookie('userId', userId, {
    maxAge: AUTH.PASSWORD_RESET_OTP_TIME,
    httpOnly: true,
    secure: true
  })
  res.cookie('email', email, {
    maxAge: AUTH.PASSWORD_RESET_OTP_TIME,
    httpOnly: true,
    secure: true
  })

  new SuccessResponse({
    message: `An email has been sent to <<${email}>>. Please check your email to enter OTP`
  }).send(res)
})

const resetPassword = asyncHandler(async (req, res) => {
  const { userId, email, passwordResetToken } = req.cookies

  await authService.resetPassword({
    ...req.body,
    userId,
    email,
    token: passwordResetToken
  })

  res.clearCookie('userId', {
    httpOnly: true,
    secure: true
  })
  res.clearCookie('email', {
    httpOnly: true,
    secure: true
  })
  res.clearCookie('passwordResetToken', {
    httpOnly: true,
    secure: true
  })

  new SuccessResponse({
    message: 'Reset password successfully'
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
  forgotPassword,
  verifyPasswordResetOtp,
  resetPassword,
  resendPasswordResetOtp,
  handleRefreshToken,
  signOut
}
