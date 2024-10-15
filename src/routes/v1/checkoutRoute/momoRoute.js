import express from 'express'
import checkoutController from '~/controllers/checkoutController'
import authMiddleware from '~/middlewares/authMiddleware'

const router = express.Router()

router
  .route('/callback')
  .post(checkoutController.momoCallback)

router.use(authMiddleware.authenticate)

router
  .route('/create-pay-url')
  .post(checkoutController.createMomoPayUrl)

export default router
