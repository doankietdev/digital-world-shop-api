import express from 'express'
import productCategoryValidation from '~/validations/productCategoryValidation'
import productCategoryController from '~/controllers/productCategoryController'
import authMiddleware from '~/middlewares/authMiddleware'
import { ROLES } from '~/utils/constants'

const router = express.Router()

router.route('/:id')
  .get(productCategoryValidation.getCategory, productCategoryController.getCategory)

router.route('/')
  .get(productCategoryController.getCategories)

router.use(authMiddleware.authenticate)

router.route('/:id')
  .patch(
    authMiddleware.checkPermission(ROLES.ADMIN),
    productCategoryValidation.updateCategory,
    productCategoryController.updateCategory
  )
  .delete(
    authMiddleware.checkPermission(ROLES.ADMIN),
    productCategoryValidation.deleteCategory,
    productCategoryController.deleteCategory
  )

router.route('/')
  .post(
    authMiddleware.checkPermission(ROLES.ADMIN),
    productCategoryValidation.createNew,
    productCategoryController.createNew
  )

export default router
