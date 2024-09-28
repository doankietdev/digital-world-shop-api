import express from 'express'
import discountValidation from '~/validations/discountValidation'
import discountController from '~/controllers/discountController'
import authMiddleware from '~/middlewares/authMiddleware'
import { INVALID_REDIS_KEY, ROLES } from '~/utils/constants'
import { redisCachingMiddleware } from '~/middlewares/redis.middleware'

const router = express.Router()

router.use(redisCachingMiddleware({ EX: 21600, NX: false }, false, INVALID_REDIS_KEY.INVALID_CACHE_DISCOUNT))

router.route('/public/:code')
  .get(
    discountValidation.getDiscountByCodePublic,
    discountController.getDiscountByCodePublic
  )

router.route('/public')
  .get(discountController.getDiscountsPublic)

router.use(authMiddleware.authenticate)

router.route('/:id')
  .get(
    authMiddleware.checkPermission(ROLES.ADMIN),
    discountValidation.getDiscount,
    discountController.getDiscount
  )
  .patch(
    authMiddleware.checkPermission(ROLES.ADMIN),
    discountValidation.updateDiscount,
    discountController.updateDiscount
  )
  .delete(
    authMiddleware.checkPermission(ROLES.ADMIN),
    discountValidation.deleteDiscount,
    discountController.deleteDiscount
  )

router.route('/')
  .get(
    authMiddleware.checkPermission(ROLES.ADMIN),
    discountController.getDiscounts
  )
  .post(
    authMiddleware.checkPermission(ROLES.ADMIN),
    discountValidation.createNew,
    discountController.createNew
  )

export default router
