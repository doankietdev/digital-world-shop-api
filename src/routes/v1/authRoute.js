import express from 'express'
import authValidation from '~/validations/authValidation'
import authController from '~/controllers/authController'
import authMiddleware from '~/middlewares/authMiddleware'

const router = express.Router()

router.post('/signup', authValidation.signUp, authController.signUp)
router.post('/signin', authValidation.signIn, authController.signIn)
router.get('/refresh-token', authController.refreshToken)

router.use(authMiddleware.authenticate)

router.post('/signout', authController.signOut)

export default router
