import productService from '~/services/productService'
import SuccessResponse from '~/utils/SuccessResponse'
import asyncHandler from '~/utils/asyncHandler'

const createNew = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Create new product successfully',
    metadata: {
      product: await productService.createNew(req.body)
    }
  }).send(res)
})

const getProduct = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Get product successfully',
    metadata: {
      product: await productService.getProduct(req.params.id, req.query)
    }
  }).send(res)
})

const getProductBySlug = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Get product successfully',
    metadata: {
      product: await productService.getProductBySlug(req.params.slug, req.query)
    }
  }).send(res)
})

const getProducts = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Get products successfully',
    metadata: {
      ...(await productService.getProducts(req.query))
    }
  }).send(res)
})

const updateProduct = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Update product successfully',
    metadata: {
      product: await productService.updateProduct(req.params.id, req.body)
    }
  }).send(res)
})

const deleteProduct = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Delete product successfully',
    metadata: {
      product: await productService.deleteProduct(req.params.id)
    }
  }).send(res)
})

const rating = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Rating product successfully',
    metadata: {
      product: await productService.rating(req.user?._id, req.body)
    }
  }).send(res)
})

const addVariant = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Add variant successfully',
    metadata: {
      product: await productService.addVariant(req.params.productId, req.files, req.body)
    }
  }).send(res)
})

const editVariant = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Edit variant successfully',
    metadata: {
      product: await productService.editVariant(
        req.params.productId,
        req.query.variantId,
        req.files,
        req.body
      )
    }
  }).send(res)
})

const deleteVariant = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Delete variant successfully',
    metadata: {
      product: await productService.deleteVariant(
        req.params.productId,
        req.query.variantId
      )
    }
  }).send(res)
})

export default {
  createNew,
  getProduct,
  getProductBySlug,
  getProducts,
  updateProduct,
  deleteProduct,
  rating,
  addVariant,
  editVariant,
  deleteVariant
}
