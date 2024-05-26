import cartService from '~/services/cartService'
import SuccessResponse from '~/utils/SuccessResponse'
import asyncHandler from '~/utils/asyncHandler'

const addToCart = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Add product to cart successfully',
    metadata: {
      cart: await cartService.addToCart({
        userId: req.user?._id,
        product: req.body
      })
    }
  }).send(res)
})

const updateProductToCart = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Update product to cart successfully',
    metadata: {
      cart: await cartService.updateProductToCart({
        userId: req.user?._id,
        product: req.body
      })
    }
  }).send(res)
})

const updateVariantToCart = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Update variant to cart successfully',
    metadata: {
      cart: await cartService.updateVariantToCart({
        userId: req.user?._id,
        product: req.body
      })
    }
  }).send(res)
})

const deleteFromCart = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Delete product from cart successfully',
    metadata: {
      cart: await cartService.deleteFromCart({
        userId: req.user?._id,
        ...req.body
      })
    }
  }).send(res)
})

const getUserCart = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Get cart successfully',
    metadata: {
      cart: await cartService.getCart({ userId: req.user?._id })
    }
  }).send(res)
})

export default {
  addToCart,
  updateProductToCart,
  updateVariantToCart,
  deleteFromCart,
  getUserCart
}
