const { default: locationService } = require('~/services/locationService')
const { default: SuccessResponse } = require('~/utils/SuccessResponse')
const { default: asyncHandler } = require('~/utils/asyncHandler')

const getProvinces = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Get provinces successfully',
    metadata: {
      provinces: await locationService.getProvinces()
    }
  }).send(res)
})

const getDistricts = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Get districts successfully',
    metadata: {
      districts: await locationService.getDistricts(req.query.provinceId)
    }
  }).send(res)
})

const getWards = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Get wards successfully',
    metadata: {
      wards: await locationService.getWards(req.query.districtId)
    }
  }).send(res)
})

export default {
  getProvinces,
  getDistricts,
  getWards
}
