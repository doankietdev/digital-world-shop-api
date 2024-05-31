const { default: locationService } = require('~/services/locationService')
const { default: SuccessResponse } = require('~/utils/SuccessResponse')
const { default: asyncHandler } = require('~/utils/asyncHandler')

const getProvinces = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Get provinces successfully',
    metadata: await locationService.getProvinces(req.query)
  }).send(res)
})

const getDistricts = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Get districts successfully',
    metadata: await locationService.getDistricts(req.query)
  }).send(res)
})

const getWards = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Get wards successfully',
    metadata: await locationService.getWards(req.query)
  }).send(res)
})

export default {
  getProvinces,
  getDistricts,
  getWards
}
