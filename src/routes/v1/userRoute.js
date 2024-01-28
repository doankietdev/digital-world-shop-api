import express from 'express'
import userController from '~/controllers/userController'
import authMiddleware from '~/middlewares/authMiddleware'

const router = express.Router()

router.get('/get-current', authMiddleware.authenticate, userController.getCurrent)

export default router
