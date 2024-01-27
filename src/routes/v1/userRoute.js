import express from 'express'
import userController from '~/controllers/userController'
import authMiddleware from '~/middlewares/authMiddleware'

const router = express.Router()

router.use(authMiddleware.authenticate)

router.get('/get-current', userController.getCurrent)

export default router
