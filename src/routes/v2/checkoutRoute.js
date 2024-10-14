import express from 'express'
import checkoutController from '~/controllers/checkoutController'
import checkoutV2Controller from '~/controllers/checkoutV2Controller'
import authMiddleware from '~/middlewares/authMiddleware'
import checkoutValidation from '~/validations/checkoutValidation'

const router = express.Router()

router.use(authMiddleware.authenticate)

router
  .route('/review')
  .post(checkoutValidation.review, checkoutV2Controller.review)

router.route('/order').post(checkoutValidation.order, checkoutController.order)

router.route('/create-paypal-order').post(checkoutController.createPayPalOrder)

router
  .route('/capture-paypal-order')
  .post(checkoutController.capturePayPalOrder)

router.route('/cancel-order').patch(checkoutController.cancelOrder)

export default router
