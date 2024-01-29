import express from 'express'
import productValidation from '~/validations/productValidation'
import productController from '~/controllers/productController'
import authMiddleware from '~/middlewares/authMiddleware'
import { ROLES } from '~/utils/constants'

const router = express.Router()

router.route('/:id')
  .get(productValidation.getProduct, productController.getProduct)
router.route('/')
  .get(productController.getProducts)

router.use(authMiddleware.authenticate)

router.route('/:id')
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

router.route('/')
  .post(
    authMiddleware.checkPermission(ROLES.ADMIN),
    productValidation.createNew,
    productController.createNew
  )

export default router
