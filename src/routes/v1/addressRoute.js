import express from 'express'
import addressValidation from '~/validations/addressValidation'
import addressController from '~/controllers/addressController'
import authMiddleware from '~/middlewares/authMiddleware'
import { ROLES } from '~/utils/constants'

const router = express.Router()

router.use(authMiddleware.authenticate)

router
  .route('/update-for-current-user/:addressId')
  .patch(
    addressValidation.updateAddressForCurrentUser,
    addressController.updateAddressForCurrentUser
  )
router
  .route('/delete-for-current-user/:addressId')
  .delete(
    addressValidation.deleteAddressForCurrentUser,
    addressController.deleteAddressForCurrentUser
  )

router.route('/get-user-address').get(addressController.getUserAddress)

router.route('/').post(addressValidation.createNew, addressController.createNew)

export default router
