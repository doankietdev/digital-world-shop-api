import cartV2Service from '~/services/cartV2Service'
import SuccessResponse from '~/utils/SuccessResponse'
import asyncHandler from '~/utils/asyncHandler'

const addToCart = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Add product to cart successfully',
    metadata: {
      cart: await cartV2Service.addToCart({
        userId: req.user?._id,
        product: req.body
      }, req.query._currency)
    }
  }).send(res)
})

const addProductsToCart = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Add products to cart successfully',
    metadata: {
      cart: await cartV2Service.addProductsToCart({
        userId: req.user?._id,
        products: req.body.products
      }, req.query._currency)
    }
  }).send(res)
})


const updateProductQuantityToCart = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Update product quantity to cart successfully',
    metadata: {
      cart: await cartV2Service.updateProductQuantityToCart({
        userId: req.user?._id,
        product: req.body
      }, req.query._currency)
    }
  }).send(res)
})

const updateVariantToCart = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Update variant to cart successfully',
    metadata: {
      cart: await cartV2Service.updateVariantToCart({
        userId: req.user?._id,
        product: req.body
      }, req.query._currency)
    }
  }).send(res)
})

const deleteFromCart = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Delete products from cart successfully',
    metadata: {
      cart: await cartV2Service.deleteFromCart({
        userId: req.user?._id,
        ...req.body
      }, req.query._currency)
    }
  }).send(res)
})

const getUserCart = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Get cart successfully',
    metadata: {
      cart: await cartV2Service.getCart(req.user?._id, req.query._currency)
    }
  }).send(res)
})

export default {
  addToCart,
  addProductsToCart,
  updateProductQuantityToCart,
  updateVariantToCart,
  deleteFromCart,
  getUserCart
}
