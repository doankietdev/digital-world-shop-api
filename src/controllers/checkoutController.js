import checkoutService from '~/services/checkoutService'
import SuccessResponse from '~/utils/SuccessResponse'
import asyncHandler from '~/utils/asyncHandler'

const review = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Get order review successfully',
    metadata: {
      ...await checkoutService.review(req.body)
    }
  }).send(res)
})

const order = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Order successfully',
    metadata: {
      ...await checkoutService.order(req.user?._id, req.body)
    }
  }).send(res)
})

const cancelOrder = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Cancel order successfully',
    metadata: {
      order: await checkoutService.cancelOrder(req.user?._id, req.params.orderId)
    }
  }).send(res)
})

export default {
  review,
  order,
  cancelOrder
}