import orderService from '~/services/orderService'
import SuccessResponse from '~/utils/SuccessResponse'
import asyncHandler from '~/utils/asyncHandler'

const getOrderOfCurrentUser = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Get order of current user successfully',
    metadata: {
      order: await orderService.getOrderOfCurrentUser(req.user?._id, req.params.orderId)
    }
  }).send(res)
})

const getOrdersOfCurrentUser = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Get orders of current user successfully',
    metadata: {
      orders: await orderService.getOrdersOfCurrentUser(req.user?._id, req.params.orderId)
    }
  }).send(res)
})

const updateStatus = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Update order status successfully',
    metadata: {
      order: await orderService.updateStatus(req.params.orderId, req.body)
    }
  }).send(res)
})

const deleteOrder = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Delete order successfully',
    metadata: {
      order: await orderService.deleteOrder(req.params.orderId)
    }
  }).send(res)
})


export default {
  getOrderOfCurrentUser,
  getOrdersOfCurrentUser,
  updateStatus,
  deleteOrder
}