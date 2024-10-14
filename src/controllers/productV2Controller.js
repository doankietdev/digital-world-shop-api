import productV2Service from '~/services/productV2Service'
import SuccessResponse from '~/utils/SuccessResponse'
import asyncHandler from '~/utils/asyncHandler'

const getProductBySlug = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Get product successfully',
    metadata: {
      product: await productV2Service.getProductBySlug(req.params.slug, req.query)
    }
  }).send(res)
})

const getProduct = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Get product successfully',
    metadata: {
      product: await productV2Service.getProduct(req.params.id, req.query)
    }
  }).send(res)
})

const getProducts = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Get products successfully',
    metadata: await productV2Service.getProducts(req.query)
  }).send(res)
})

const search = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Search products successfully',
    metadata: await productV2Service.search(req.query)
  }).send(res)
})

export default {
  getProductBySlug,
  getProduct,
  getProducts,
  search
}
