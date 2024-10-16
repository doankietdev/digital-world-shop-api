import express from 'express'
import checkoutController from '~/controllers/checkoutController'
import authMiddleware from '~/middlewares/authMiddleware'

const router = express.Router()

router
  .route('/callback')
  .post(checkoutController.callbackMomo)

router.use(authMiddleware.authenticate)

router
  .route('/init-payment')
  .post(checkoutController.initMomoPayment)

export default router
