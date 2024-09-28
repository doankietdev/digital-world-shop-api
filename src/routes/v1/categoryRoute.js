import express from 'express'
import categoryValidation from '~/validations/categoryValidation'
import categoryController from '~/controllers/categoryController'
import authMiddleware from '~/middlewares/authMiddleware'
import { INVALID_REDIS_KEY, ROLES } from '~/utils/constants'
import { redisCachingMiddleware } from '~/middlewares/redis.middleware'

const router = express.Router()

router.use(redisCachingMiddleware({ EX: 21600, NX: false }, false, INVALID_REDIS_KEY.INVALID_CACHE_CATEGORY))

router
  .route('/get-by-slug/:slug')
  .get(categoryController.getCategoryBySlug)

router
  .route('/:id')
  .get(categoryValidation.getCategory, categoryController.getCategory)

router.route('/').get(categoryController.getCategories)

router.use(authMiddleware.authenticate)

router
  .route('/:id')
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

router
  .route('/')
  .post(
    authMiddleware.checkPermission(ROLES.ADMIN),
    categoryValidation.createNew,
    categoryController.createNew
  )

export default router
