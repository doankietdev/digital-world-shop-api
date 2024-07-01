import { StatusCodes } from 'http-status-codes'
import mongooseHelper from '~/helpers/mongooseHelper'
import orderModel from '~/models/orderModel'
import ApiError from '~/utils/ApiError'
import { parseQueryParams } from '~/utils/formatter'
import { calculateTotalPages } from '~/utils/util'

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

const getOrdersOfCurrentUser = async (userId, reqQuery) => {
  try {
    const { query, limit, page, skip, sort } = parseQueryParams(reqQuery)

    const [foundOrders, totalOrders] = await Promise.all([
      orderModel
        .find({ ...query, user: userId })
        .limit(limit)
        .skip(skip)
        .sort(sort)
        .select('-user')
        .populate({
          path: 'products.product',
          select:
            '-specs -brand -category -price -quantity -ratings -createdAt -updatedAt'
        }),
      orderModel.find({ ...query, user: userId }).countDocuments()
    ])

    // attach variant object
    const orders =
      mongooseHelper.convertMongooseArrayToVanillaArray(foundOrders)
    for (const order of orders) {
      for (const orderProduct of order.products) {
        orderProduct.variant = {
          ...orderProduct.product.variants.find(
            (variant) =>
              variant._id.toString() === orderProduct.variant.toString()
          ),
          quantity: undefined // delete quantity field
        }
        delete orderProduct.product.quantity
        delete orderProduct.product.variants
      }
    }

    return {
      page,
      limit,
      totalPages: calculateTotalPages(totalOrders, limit),
      totalItems: orders.length,
      items: orders
    }
  } catch (error) {
    if (error.name === ApiError.name) throw error
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Get orders of current user failed'
    )
  }
}

const updateStatus = async ({ userId, orderId, status }) => {
  try {
    const foundOrder = await orderModel.findOne({ _id: orderId, user: userId })
    if (!foundOrder)
      throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found')

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
