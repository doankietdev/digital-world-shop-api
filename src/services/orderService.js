import { StatusCodes } from 'http-status-codes'
import mongooseHelper from '~/helpers/mongooseHelper'
import orderModel from '~/models/orderModel'
import ApiError from '~/utils/ApiError'
import { parseQueryParams } from '~/utils/formatter'
import { calculateTotalPages } from '~/utils/util'
import addressService from './addressService'
import addressModel from '~/models/addressModel'
import { ORDER_STATUSES, PARTNER_APIS } from '~/utils/constants'
import ghnAxiosClient from '~/configs/ghnAxiosClient'
import productModel from '~/models/productModel'

const getOrderOfCurrentUser = async (userId, orderId) => {
  try {
    const { items: [foundOrder] } = await getOrdersOfCurrentUser(userId, {
      _id: orderId
    })
    if (!foundOrder)
      throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found')
    return foundOrder
  } catch (error) {
    if (error.name === ApiError.name) throw error
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

    let orders = []
    // attach shippingAddress
    for (const order of foundOrders) {
      orders = [
        ...orders,
        {
          ...mongooseHelper.convertMongooseObjectToVanillaObject(order),
          shippingAddress: await addressService.getUserAddress({ userId, addressId: order.shippingAddress })
        }
      ]
    }

    // attach variant object
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

const updateStatusById = async (id, status) => {
  const foundOrder = await orderModel.findOne({ _id: id })
  if (!foundOrder)
    throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found')

  const updatedOrder = await orderModel.findOneAndUpdate(
    { _id: id },
    {
      $set: { status },
      $push: { statusHistory: { status: foundOrder.status } }
    },
    { new: true }
  )
  if (!updatedOrder)
    throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found')
  return updatedOrder
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

const updateShippingAddress = async ({ userId, orderId, addressId }) => {
  try {
    const foundOrder = await orderModel.findOne({ _id: orderId, user: userId })
    if (!foundOrder) throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found')
    const foundAddress = await addressModel.findOne({ _id: addressId, user: userId })
    if (!foundAddress) throw new ApiError(StatusCodes.NOT_FOUND, 'Address not found')

    if (foundOrder.status !== ORDER_STATUSES.PENDING && foundOrder.status !== ORDER_STATUSES.PAID) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Cannot update shipping address')
    }

    const foundProducts = await productModel.find({
      '_id': {
        '$in': foundOrder.products.map(orderProduct => orderProduct.product)
      }
    }).lean()
    const totalWeight = foundProducts.reduce((acc, product) => {
      const spec = product.specs.find(spec => spec.k === 'weight')
      if (!spec) return acc
      return acc + spec.v
    }, 0)

    const { total: shippingFee } = await ghnAxiosClient.post(
      PARTNER_APIS.GHN.APIS.CALCULATE_FEE,
      {
        to_ward_code: foundAddress.wardCode,
        to_district_id: foundAddress.districtId,
        weight: totalWeight ?? 300,
        service_id: PARTNER_APIS.GHN.SERVICE_ID,
        service_type_id: PARTNER_APIS.GHN.SERVICE_TYPE_ID
      }
    )
    const { modifiedCount } = await orderModel.updateOne(
      {
        _id: orderId,
        user: userId
      },
      {
        shippingAddress: addressId,
        shippingFee
      }
    )
    if (modifiedCount === 0) throw new Error('Update order failed')

    return await getOrderOfCurrentUser(userId, orderId)
  } catch (error) {
    if (error.name === ApiError.name) throw error
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong')
  }
}

export default {
  getOrderOfCurrentUser,
  getOrdersOfCurrentUser,
  updateStatus,
  updateStatusById,
  updateShippingAddress,
  deleteOrder
}
