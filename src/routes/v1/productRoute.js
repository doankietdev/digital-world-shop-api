import express from 'express'
import productValidation from '~/validations/productValidation'
import productController from '~/controllers/productController'
import authMiddleware from '~/middlewares/authMiddleware'
import { ROLES } from '~/utils/constants'
import uploadMiddleware from '~/middlewares/uploadMiddleware'

const router = express.Router()

router.route('/:id')
  .get(productValidation.getProduct, productController.getProduct)

router.route('/')
  .get(productController.getProducts)

router.use(authMiddleware.authenticate)

router.route('/rating')
  .patch(
    productValidation.rating,
    productController.rating
  )

router.route('/:id')
  .patch(
    authMiddleware.checkPermission(ROLES.ADMIN),
    uploadMiddleware.array('images'),
    productValidation.updateProduct,
    productController.updateProduct
  )
  .delete(
    authMiddleware.checkPermission(ROLES.ADMIN),
    productValidation.deleteProduct,
    productController.deleteProduct
  )

router.route('/')
  .post(
    authMiddleware.checkPermission(ROLES.ADMIN),
    uploadMiddleware.array('images'),
    productValidation.createNew,
    productController.createNew
  )

export default router
