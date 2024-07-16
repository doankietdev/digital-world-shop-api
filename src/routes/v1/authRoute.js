import express from 'express'
import authController from '~/controllers/authController'
import authValidation from '~/validations/authValidation'

const router = express.Router()

router
  .route('/sign-up')
  .post(authValidation.signUp, authController.signUp)

router
  .route('/verify-email')
  .post(
    authValidation.verifyEmail,
    authController.verifyEmail
  )

router
  .route('/sign-in')
  .post(authValidation.signIn, authController.signIn)

router
  .route('/refresh-token')
  .put(authController.refreshToken)

router
  .route('/forgot-password')
  .post(authValidation.forgotPassword, authController.forgotPassword)

router
  .route('/verify-password-reset-otp')
  .post(
    authValidation.verifyPasswordResetOtp,
    authController.verifyPasswordResetOtp
  )

router
  .route('/reset-password')
  .post(
    authValidation.resetPassword,
    authController.resetPassword
  )

export default router
