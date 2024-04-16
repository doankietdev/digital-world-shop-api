import express from 'express'
import authValidation from '~/validations/authValidation'
import authController from '~/controllers/authController'
import authMiddleware from '~/middlewares/authMiddleware'

const router = express.Router()

router.route('/sign-up').post(authValidation.signUp, authController.signUp)

router.route('/verify-email').post(authController.verifyEmail)

router.route('/sign-in').post(authValidation.signIn, authController.signIn)

router.route('/refresh-token').get(authController.handleRefreshToken)

router.use(authMiddleware.authenticate)

router.route('/sign-out').post(authController.signOut)

export default router
