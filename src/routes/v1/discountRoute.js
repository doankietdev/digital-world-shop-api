import express from 'express'
import discountValidation from '~/validations/discountValidation'
import discountController from '~/controllers/discountController'
import authMiddleware from '~/middlewares/authMiddleware'
import { ROLES } from '~/utils/constants'

const router = express.Router()

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
