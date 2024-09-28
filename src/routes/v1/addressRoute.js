import express from 'express'
import addressController from '~/controllers/addressController'
import authMiddleware from '~/middlewares/authMiddleware'
import addressValidation from '~/validations/addressValidation'
import { redisCachingMiddleware } from '~/middlewares/redis.middleware'
import { INVALID_REDIS_KEY } from '~/utils/constants'

const router = express.Router()

router.use(authMiddleware.authenticate)

router.use(redisCachingMiddleware({ EX: 21600, NX: false }, false, INVALID_REDIS_KEY.INVALID_CACHE_ADDRESS))

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
