import express from 'express'
import authValidation from '~/validations/authValidation'
import authController from '~/controllers/authController'
import authMiddleware from '~/middlewares/authMiddleware'

const router = express.Router()

router.route('/sign-up').post(authValidation.signUp, authController.signUp)

router.route('/sign-in').post(authValidation.signIn, authController.signIn)

router.route('/refresh-token').get(authController.handleRefreshToken)

router.route('/forgot-password').post(authController.forgotPassword)

router.route('/reset-password').post(authController.resetPassword)

router.use(authMiddleware.authenticate)

router.route('/sign-out').post(authController.signOut)

export default router
