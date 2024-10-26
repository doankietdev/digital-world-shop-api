import express from 'express'
import cartV2Controller from '~/controllers/cartV2Controller'
import authMiddleware from '~/middlewares/authMiddleware'
import { redisCachingMiddleware } from '~/middlewares/redis.middleware'
import { INVALID_REDIS_KEY } from '~/utils/constants'
import cartValidation from '~/validations/cartValidation'

const router = express.Router()

router.use(authMiddleware.authenticate)

router.use(redisCachingMiddleware({ EX: 21600, NX: false }, false, INVALID_REDIS_KEY.INVALID_CACHE_CART))


router
  .route('/add-to-cart')
  .post(cartValidation.addToCart, cartV2Controller.addToCart)

router
  .route('/add-products-to-cart')
  .post(cartValidation.addProductsToCart, cartV2Controller.addProductsToCart)

router
  .route('/update-product-quantity')
  .post(cartValidation.updateProductQuantityToCart, cartV2Controller.updateProductQuantityToCart)

router
  .route('/update-variant')
  .post(cartValidation.updateVariantToCart, cartV2Controller.updateVariantToCart)

router
  .route('/delete-products')
  .post(cartValidation.deleteFromCart, cartV2Controller.deleteFromCart)

router.route('/get-user-cart').get(cartV2Controller.getUserCart)

export default router
