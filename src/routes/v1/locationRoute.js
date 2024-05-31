import express from 'express'
import locationController from '~/controllers/locationController'

const router = express.Router()

router.route('/get-provinces').get(locationController.getProvinces)

router.route('/get-districts').get(locationController.getDistricts)

router.route('/get-wards').get(locationController.getWards)

export default router
