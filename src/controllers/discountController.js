import discountService from '~/services/discountService'
import SuccessResponse from '~/utils/SuccessResponse'
import asyncHandler from '~/utils/asyncHandler'

const createNew = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Create new discount successfully',
    metadata: {
      discount: await discountService.createNew(req.body)
    }
  }).send(res)
})

const getDiscount = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Get discount successfully',
    metadata: {
      discount: await discountService.getDiscount(req.params.id, req.query)
    }
  }).send(res)
})

const getDiscountByCodePublic = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Get discount by code successfully',
    metadata: {
      discount: await discountService.getDiscountByCodePublic(
        req.params.code,
        req.query
      )
    }
  }).send(res)
})

const getDiscounts = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Get discounts successfully',
    metadata: {
      ...(await discountService.getDiscounts(req.query))
    }
  }).send(res)
})

const getDiscountsPublic = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Get discounts successfully',
    metadata: {
      ...(await discountService.getDiscountsPublic(req.query))
    }
  }).send(res)
})

const updateDiscount = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Update discount successfully',
    metadata: {
      discount: await discountService.updateDiscount(req.params.id, req.body)
    }
  }).send(res)
})

const deleteDiscount = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Delete discount successfully',
    metadata: {
      discount: await discountService.deleteDiscount(req.params.id)
    }
  }).send(res)
})

export default {
  createNew,
  getDiscount,
  getDiscountByCodePublic,
  getDiscounts,
  getDiscountsPublic,
  updateDiscount,
  deleteDiscount
}
