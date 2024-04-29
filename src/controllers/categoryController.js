import categoryService from '~/services/categoryService'
import SuccessResponse from '~/utils/SuccessResponse'
import asyncHandler from '~/utils/asyncHandler'

const createNew = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Create new category successfully',
    metadata: {
      category: await categoryService.createNew(req.body)
    }
  }).send(res)
})

const getCategory = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Get category successfully',
    metadata: {
      category: await categoryService.getCategory(req.params.id, req.query)
    }
  }).send(res)
})

const getCategoryBySlug = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Get category successfully',
    metadata: {
      category: await categoryService.getCategoryBySlug(req.params.slug, req.query)
    }
  }).send(res)
})

const getCategories = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Get categories successfully',
    metadata: {
      ...(await categoryService.getCategories(req.query))
    }
  }).send(res)
})

const updateCategory = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Update category successfully',
    metadata: {
      category: await categoryService.updateCategory(req.params.id, req.body)
    }
  }).send(res)
})

const deleteCategory = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Delete category successfully',
    metadata: {
      category: await categoryService.deleteCategory(req.params.id)
    }
  }).send(res)
})

export default {
  createNew,
  getCategory,
  getCategoryBySlug,
  getCategories,
  updateCategory,
  deleteCategory
}
