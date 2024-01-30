import productCategoryService from '~/services/productCategoryService'
import SuccessResponse from '~/utils/SuccessResponse'
import asyncHandler from '~/utils/asyncHandler'

const createNew = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Create new product category successfully',
    metadata: {
      category: await productCategoryService.createNew(req.body)
    }
  }).send(res)
})

const getCategory = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Get product category successfully',
    metadata: {
      category: await productCategoryService.getCategory(req.params.id, req.query)
    }
  }).send(res)
})

const getCategories = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Get product categories successfully',
    metadata: {
      ...await productCategoryService.getCategories(req.query)
    }
  }).send(res)
})

const updateCategory = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Update product category successfully',
    metadata: {
      category: await productCategoryService.updateCategory(req.params.id, req.body)
    }
  }).send(res)
})

const deleteCategory = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Delete product category successfully',
    metadata: {
      category: await productCategoryService.deleteCategory(req.params.id)
    }
  }).send(res)
})

export default {
  createNew,
  getCategory,
  getCategories,
  updateCategory,
  deleteCategory
}