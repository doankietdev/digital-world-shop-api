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
  .route('/add-products-to-cart')
  .post(cartValidation.addProductsToCart, cartController.addProductsToCart)

router
  .route('/update-product-quantity')
  .post(cartValidation.updateProductQuantityToCart, cartController.updateProductQuantityToCart)

router
  .route('/update-variant')
  .post(cartValidation.updateVariantToCart, cartController.updateVariantToCart)

router
  .route('/delete-products')
  .post(cartValidation.deleteFromCart, cartController.deleteFromCart)

router.route('/get-user-cart').get(cartController.getUserCart)

export default router
