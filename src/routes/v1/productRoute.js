import express from 'express'
import productValidation from '~/validations/productValidation'
import productController from '~/controllers/productController'
import authMiddleware from '~/middlewares/authMiddleware'
import { INVALID_REDIS_KEY, ROLES } from '~/utils/constants'
import uploadMiddleware from '~/middlewares/uploadMiddleware'
import { redisCachingMiddleware } from '~/middlewares/redis.middleware'

const router = express.Router()

// router.use(redisCachingMiddleware({ EX: 21600, NX: false }, false, INVALID_REDIS_KEY.INVALID_CACHE_PRODUCT))

router.route('/get-by-slug/:slug').get(productController.getProductBySlug)

router.route('/search').get(productValidation.search, productController.search)

router
  .route('/:id')
  .get(productValidation.getProduct, productController.getProduct)

router.route('/').get(productController.getProducts)

router.use(authMiddleware.authenticate)

router
  .route('/rating')
  .patch(productValidation.rating, productController.rating)

router
  .route('/:id/upload-thumb')
  .patch(
    authMiddleware.checkPermission(ROLES.ADMIN),
    uploadMiddleware.single('thumb'),
    productValidation.uploadThumb,
    productController.uploadThumb
  )

router
  .route('/:id/delete-thumb')
  .patch(
    authMiddleware.checkPermission(ROLES.ADMIN),
    productValidation.deleteThumb,
    productController.deleteThumb
  )

router
  .route('/:id')
  .patch(
    authMiddleware.checkPermission(ROLES.ADMIN),
    productValidation.updateProduct,
    productController.updateProduct
  )
  .delete(
    authMiddleware.checkPermission(ROLES.ADMIN),
    productValidation.deleteProduct,
    productController.deleteProduct
  )

router
  .route('/:productId/add-variant')
  .patch(
    authMiddleware.checkPermission(ROLES.ADMIN),
    uploadMiddleware.array('images'),
    productValidation.addVariant,
    productController.addVariant
  )

router
  .route('/:productId/edit-variant')
  .patch(
    authMiddleware.checkPermission(ROLES.ADMIN),
    uploadMiddleware.array('images'),
    productValidation.editVariant,
    productController.editVariant
  )

router
  .route('/:productId/delete-variant')
  .delete(
    authMiddleware.checkPermission(ROLES.ADMIN),
    productValidation.deleteVariant,
    productController.deleteVariant
  )

router.route('/').post(
  // authMiddleware.checkPermission(ROLES.ADMIN),
  uploadMiddleware.single('thumb'),
  productValidation.createNew,
  productController.createNew
)

export default router
