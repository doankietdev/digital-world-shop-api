import express from 'express'
import authController from '~/controllers/authController'
import authMiddleware from '~/middlewares/authMiddleware'
import authValidation from '~/validations/authValidation'

const router = express.Router()

router
  .route('/sign-up')
  .post(authValidation.signUp, authController.signUp)

router
  .route('/verify-account')
  .post(
    authValidation.verifyAccount,
    authController.verifyAccount
  )

router
  .route('/sign-in')
  .post(authValidation.signIn, authController.signIn)

router
  .route('/sign-out')
  .delete(authValidation.signOut, authController.signOut)

router
  .route('/refresh-token')
  .put(authValidation.refreshToken, authController.refreshToken)

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

router.use(authMiddleware.authenticate)

router
  .route('/sign-in-status')
  .get(authController.signInStatus)

export default router
