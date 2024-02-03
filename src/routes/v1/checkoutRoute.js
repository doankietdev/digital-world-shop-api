import express from 'express'
import checkoutController from '~/controllers/checkoutController'
import authMiddleware from '~/middlewares/authMiddleware'

const router = express.Router()

router.use(authMiddleware.authenticate)

router.route('/review')
  .post(checkoutController.review)

export default router