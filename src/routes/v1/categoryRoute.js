import express from 'express'
import categoryValidation from '~/validations/categoryValidation'
import categoryController from '~/controllers/categoryController'
import authMiddleware from '~/middlewares/authMiddleware'
import { ROLES } from '~/utils/constants'

const router = express.Router()

router.route('/:id')
  .get(categoryValidation.getCategory, categoryController.getCategory)

router.route('/')
  .get(categoryController.getCategories)

router.use(authMiddleware.authenticate)

router.route('/:id')
  .patch(
    authMiddleware.checkPermission(ROLES.ADMIN),
    categoryValidation.updateCategory,
    categoryController.updateCategory
  )
  .delete(
    authMiddleware.checkPermission(ROLES.ADMIN),
    categoryValidation.deleteCategory,
    categoryController.deleteCategory
  )

router.route('/')
  .post(
    authMiddleware.checkPermission(ROLES.ADMIN),
    categoryValidation.createNew,
    categoryController.createNew
  )

export default router
