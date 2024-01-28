import express from 'express'
import authValidation from '~/validations/authValidation'
import authController from '~/controllers/authController'
import authMiddleware from '~/middlewares/authMiddleware'

const router = express.Router()

router.post('/sign-up', authValidation.signUp, authController.signUp)
router.post('/sign-in', authValidation.signIn, authController.signIn)
router.get('/refresh-token', authController.handleRefreshToken)
router.post('/forgot-password', authController.forgotPassword)
router.post('/reset-password', authController.resetPassword)

router.post('/sign-out', authMiddleware.authenticate, authController.signOut)

export default router
