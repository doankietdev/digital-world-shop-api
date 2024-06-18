import express from 'express'
import addressController from '~/controllers/addressController'
import authMiddleware from '~/middlewares/authMiddleware'
import addressValidation from '~/validations/addressValidation'

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

router.route('/get-user-addresses').get(addressController.getUserAddresses)
router.route('/get-user-address/:addressId').get(addressController.getUserAddress)

router.route('/').post(addressValidation.createNew, addressController.createNew)

export default router
