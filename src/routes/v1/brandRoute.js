import express from 'express'
import brandController from '~/controllers/brandController'
import authMiddleware from '~/middlewares/authMiddleware'
import { INVALID_REDIS_KEY, ROLES } from '~/utils/constants'
import brandValidation from '~/validations/brandValidation'
import { redisCachingMiddleware } from '~/middlewares/redis.middleware'

const router = express.Router()

router.use(redisCachingMiddleware({ EX: 21600, NX: false }, false, INVALID_REDIS_KEY.INVALID_CACHE_BRAND))

router.route('/:id')
  .get(brandValidation.getBrand, brandController.getBrand)

router.route('/')
  .get(brandController.getBrands)

router.use(authMiddleware.authenticate)

router.route('/:id')
  .patch(
    authMiddleware.checkPermission(ROLES.ADMIN),
    brandValidation.updateBrand,
    brandController.updateBrand
  )
  .delete(
    authMiddleware.checkPermission(ROLES.ADMIN),
    brandValidation.deleteBrand,
    brandController.deleteBrand
  )

router.route('/')
  .post(
    authMiddleware.checkPermission(ROLES.ADMIN),
    brandValidation.createNew,
    brandController.createNew
  )

export default router
