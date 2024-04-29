import express from 'express'
import brandController from '~/controllers/brandController'
import authMiddleware from '~/middlewares/authMiddleware'
import { ROLES } from '~/utils/constants'
import brandValidation from '~/validations/brandValidation'

const router = express.Router()

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
