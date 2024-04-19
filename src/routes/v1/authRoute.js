import express from 'express'
import authValidation from '~/validations/authValidation'
import authController from '~/controllers/authController'
import authMiddleware from '~/middlewares/authMiddleware'

const router = express.Router()

router.route('/sign-up').post(authValidation.signUp, authController.signUp)

router.route('/verify-email').post(authController.verifyEmail)

router.route('/sign-in').post(authValidation.signIn, authController.signIn)

router.route('/refresh-token').get(authController.handleRefreshToken)

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
  .route('/resend-password-reset-otp')
  .post(
    authController.resendPasswordResetOtp
  )

router
  .route('/reset-password')
  .post(authValidation.resetPassword, authController.resetPassword)

router.use(authMiddleware.authenticate)

router.route('/sign-out').post(authController.signOut)

export default router
