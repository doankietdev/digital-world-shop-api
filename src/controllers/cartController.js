import cartService from '~/services/cartService'
import SuccessResponse from '~/utils/SuccessResponse'
import asyncHandler from '~/utils/asyncHandler'

const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body

  new SuccessResponse({
    message: 'Add product to cart successfully',
    metadata: {
      cart: await cartService.addToCart({
        userId: req.user?._id,
        product: {
          productId,
          quantity
        }
      })
    }
  }).send(res)
})

const updateProductToCart = asyncHandler(async (req, res) => {
  const { productId, quantity, oldQuantity } = req.body

  new SuccessResponse({
    message: 'Update product to cart successfully',
    metadata: {
      cart: await cartService.updateProductToCart({
        userId: req.user?._id,
        product: {
          productId,
          quantity,
          oldQuantity
        }
      })
    }
  }).send(res)
})

const deleteFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.body

  await cartService.deleteFromCart({
    userId: req.user?._id,
    productId
  })
  new SuccessResponse({
    message: 'Delete product from cart successfully'
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
  deleteFromCart,
  getUserCart
}
