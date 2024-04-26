import express from 'express'
import productValidation from '~/validations/productValidation'
import productController from '~/controllers/productController'
import authMiddleware from '~/middlewares/authMiddleware'
import { ROLES } from '~/utils/constants'
import uploadMiddleware from '~/middlewares/uploadMiddleware'

const router = express.Router()

router
  .route('/:id')
  .get(productValidation.getProduct, productController.getProduct)

router
  .route('/get-by-slug/:slug')
  .get(productController.getProductBySlug)

router.route('/').get(productController.getProducts)

router.use(authMiddleware.authenticate)

router
  .route('/rating')
  .patch(productValidation.rating, productController.rating)

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

router
  .route('/')
  .post(
    authMiddleware.checkPermission(ROLES.ADMIN),
    productValidation.createNew,
    productController.createNew
  )

export default router
