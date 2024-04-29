import brandService from '~/services/brandService'
import SuccessResponse from '~/utils/SuccessResponse'
import asyncHandler from '~/utils/asyncHandler'

const createNew = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Create brand successfully',
    metadata: {
      brand: await brandService.createNew(req.body)
    }
  }).send(res)
})

const getBrand = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Get brand successfully',
    metadata: {
      category: await brandService.getBrand(req.params.id, req.query)
    }
  }).send(res)
})

const getBrands = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Get brands successfully',
    metadata: {
      ...await brandService.getBrands(req.query)
    }
  }).send(res)
})

const updateBrand = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Update brand successfully',
    metadata: {
      brand: await brandService.updateBrand(req.params.id, req.body)
    }
  }).send(res)
})

const deleteBrand = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Delete brand successfully',
    metadata: {
      brand: await brandService.deleteBrand(req.params.id)
    }
  }).send(res)
})

export default {
  createNew,
  getBrand,
  getBrands,
  updateBrand,
  deleteBrand
}