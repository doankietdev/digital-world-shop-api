import { StatusCodes } from 'http-status-codes'
import orderModel from '~/models/orderModel'
import ApiError from '~/utils/ApiError'

const getOrderOfCurrentUser = async (userId, orderId) => {
  try {
    const foundOrder = await orderModel.findOne({
      _id: orderId,
      orderBy: userId
    })
    if (!foundOrder)
      throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found')
    return foundOrder.toObject()
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Get order of current user failed'
    )
  }
}

const getOrdersOfCurrentUser = async (userId) => {
  try {
    const foundOrders = await orderModel.find({ orderBy: userId })
    if (!foundOrders)
      throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found')
    return foundOrders
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Get orders of current user failed'
    )
  }
}

const updateStatus = async ({ userId, orderId, status }) => {
  try {
    const foundOrder = await orderModel.findOne({ _id: orderId, user: userId })
    if (!foundOrder) throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found')

    const updatedOrder = await orderModel.findOneAndUpdate(
      { _id: orderId, user: userId },
      {
        $set: { status },
        $push: { statusHistory: { status: foundOrder.status } }
      },
      { new: true }
    )
    if (!updatedOrder)
      throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found')
    return updatedOrder
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Update order status failed'
    )
  }
}

const deleteOrder = async (orderId) => {
  try {
    const deletedOrder = await orderModel.findByIdAndDelete({ _id: orderId })
    if (!deletedOrder)
      throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found')
    return deletedOrder
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Delete order failed')
  }
}

export default {
  getOrderOfCurrentUser,
  getOrdersOfCurrentUser,
  updateStatus,
  deleteOrder
}
