import express from 'express'
import cartController from '~/controllers/cartController'
import authMiddleware from '~/middlewares/authMiddleware'
import cartValidation from '~/validations/cartValidation'

const router = express.Router()

router.use(authMiddleware.authenticate)

router
  .route('/add-to-cart')
  .post(cartValidation.addToCart, cartController.addToCart)

router
  .route('/update-product-quantity')
  .post(cartValidation.updateProductToCart, cartController.updateProductToCart)

router
  .route('/update-variant')
  .post(cartValidation.updateVariantToCart, cartController.updateVariantToCart)

router
  .route('/delete-product')
  .post(cartValidation.deleteFromCart, cartController.deleteFromCart)

router.route('/get-user-cart').get(cartController.getUserCart)

export default router
