import { StatusCodes } from 'http-status-codes'
import orderModel from '~/models/orderModel'
import productModel from '~/models/productModel'
import userModel from '~/models/userModel'
import paypalProvider from '~/providers/paypalProvider'
import checkoutRepo from '~/repositories/checkoutRepo'
import orderRepo from '~/repositories/orderRepo'
import ApiError from '~/utils/ApiError'
import { ORDER_STATUSES, PAYMENT_METHODS } from '~/utils/constants'
import cartService from './cartService'
import orderService from './orderService'
import userService from './userService'

/**
 * @param {*} userId
 * @param {*} reqBody
 * @returns {Promise<{
 *  orderProducts: [{
 *    product: {
 *      _id: import('mongoose').ObjectId,
 *      title: string,
 *      slug: string,
 *      thumb: string,
 *      brand: object,
 *      variant: {
 *        _id: import('mongoose').ObjectId,
 *        name: string,
 *        images: [string],
 *        quantity: number
 *      },
 *      specs: [{
 *        k: string,
 *        v: string,
 *        u: string
 *      }],
 *      oldPrice: number,
 *      price: number,
 *      discounts: [object]
 *    },
 *    quantity: string,
 *    totalPrice: number,
 *    totalPriceApplyDiscount: number
 *  }]
 *  totalPrice: number,
 *  totalPriceApplyDiscount: number,
 *  totalPayment: number,
 *  shippingFee: number}>}
 */
const review = async (userId, reqBody) => {
  try {
    const { orderProducts } = reqBody || {}
    const checkedProducts = await checkoutRepo.checkProductsAvailable(
      orderProducts
    )
    const hasOrderProductExceedQuantity = checkedProducts.includes(null)
    if (hasOrderProductExceedQuantity)
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Order wrong')

    const foundProducts = await productModel
      .find({
        _id: {
          $in: orderProducts.map((orderProduct) => orderProduct.productId)
        }
      })
      .lean()
    const productsApplyDiscount = await checkoutRepo.getProductsApplyDiscount(
      foundProducts
    )

    const isValidOrder = orderProducts.some((orderProduct) => {
      productsApplyDiscount.some((productApplyDiscount) => {
        if (productApplyDiscount.oldPrice !== orderProduct.oldPrice)
          return false
        if (productApplyDiscount.price !== orderProduct.price) {
          return false
        }
        return true
      })
      const product = productsApplyDiscount.find((product) =>
        product._id.equals(orderProduct.productId)
      )
      if (!product) return false
      if (product.oldPrice !== orderProduct.oldPrice) return false
      if (product.price !== orderProduct.price) return false
      return true
    })
    if (!isValidOrder)
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Order wrong')

    let totalWeight = 0
    const responseOrderProducts = orderProducts.map((orderProduct) => {
      const productApplyDiscount = productsApplyDiscount.find(
        (productApplyDiscount) =>
          productApplyDiscount._id.equals(orderProduct.productId)
      )

      const weight = productApplyDiscount.specs.find(
        (spec) => spec.k === 'weight'
      )
      if (weight) totalWeight = totalWeight + weight.v * orderProduct.quantity

      return {
        product: {
          ...productApplyDiscount,
          variant: {
            ...productApplyDiscount.variants?.find(
              (variant) => variant?._id.toString() === orderProduct.variantId
            ),
            quantity: undefined
          },
          variants: undefined,
          specs: undefined
        },
        quantity: orderProduct.quantity,
        totalPrice: productApplyDiscount.oldPrice * orderProduct.quantity,
        totalPriceApplyDiscount:
          productApplyDiscount.price * orderProduct.quantity
      }
    })

    const totalPriceApplyDiscount = responseOrderProducts.reduce(
      (acc, orderProduct) => (acc += orderProduct.totalPriceApplyDiscount),
      0
    )

    let reviewInfo = {
      orderProducts: responseOrderProducts,
      totalPrice: responseOrderProducts.reduce(
        (acc, orderProduct) => (acc += orderProduct.totalPrice),
        0
      ),
      totalPriceApplyDiscount,
      totalPayment: totalPriceApplyDiscount
    }

    const foundUser = await userModel
      .findOne({
        _id: userId
      })
      .populate('defaultAddress')
      .lean()
    if (!foundUser) throw new Error('User not found')
    // if (foundUser.defaultAddress) {
    //   const { total: shippingFee } = await ghnAxiosClient.post(
    //     PARTNER_APIS.GHN.APIS.CALCULATE_FEE,
    //     {
    //       to_ward_code: foundUser.defaultAddress.wardCode,
    //       to_district_id: foundUser.defaultAddress.districtId,
    //       weight: totalWeight,
    //       service_id: PARTNER_APIS.GHN.SERVICE_ID,
    //       service_type_id: PARTNER_APIS.GHN.SERVICE_TYPE_ID
    //     }
    //   )
    //   reviewInfo = {
    //     ...reviewInfo,
    //     shippingFee,
    //     totalPayment: shippingFee + reviewInfo.totalPriceApplyDiscount
    //   }
    // }

    return reviewInfo
  } catch (error) {
    if (error.name === ApiError.name) throw error
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Something went wrong'
    )
  }
}

/**
 *
 * @param {*} userId
 * @param {*} reqBody
 * @returns {Promise<{
 *  _id: string,
 *  products: [{
 *    productId: string,
 *     variantId: string,
 *    quantity: number,
 *    oldPrice: number,
 *    price: number
 *  }],
 *  shippingAddress: string,
 *  paymentMethod: string,
 *  shippingFee: number,
 *  status: string,
 *  user: string,
 *  statusHistory: [{
 *    status: string,
 *    date: string
 *  }],
 *  totalProductsPrice: number,
 *  totalPayment: number,
 *  createdAt: string,
 *  updatedAt: string
 * }>}
 */
const order = async (userId, reqBody) => {
  try {
    const { paymentMethod } = reqBody

    const foundUser = await userService.getUser(userId)

    const { shippingFee, orderProducts } = await review(userId, reqBody)

    const newOrder = await orderModel.create({
      products: orderProducts.map(({ product, quantity }) => ({
        productId: product._id,
        variantId: product.variant._id,
        quantity,
        oldPrice: product.oldPrice,
        price: product.price
      })),
      shippingAddress: foundUser.defaultAddress._id,
      shippingFee: shippingFee ?? 0,
      paymentMethod,
      user: foundUser._id
    })
    await cartService.deleteFromCart({
      userId,
      products: reqBody.orderProducts.map((orderProduct) => ({
        productId: orderProduct.productId,
        variantId: orderProduct.variantId
      }))
    })
    return await orderRepo.findById(newOrder._id)
  } catch (error) {
    if (error.name === ApiError.name) throw error
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Something went wrong'
    )
  }
}

const createPayPalOrder = async (userId, reqBody) => {
  const [
    { shippingFee = 0, totalPriceApplyDiscount, totalPayment, orderProducts }
    // { firstName, lastName, email, defaultAddress }
  ] = await Promise.all([review(userId, reqBody), userService.getUser(userId)])

  return await paypalProvider.createOrder({
    items: orderProducts.map((orderProduct) => ({
      name: orderProduct.product.title,
      quantity: orderProduct.quantity,
      unit_amount: {
        currency_code: 'USD',
        value: Math.round(orderProduct.product.price / 23500)
      }
    })),
    amount: {
      currency_code: 'USD',
      value: Math.round(totalPayment / 23500),
      breakdown: {
        item_total: {
          currency_code: 'USD',
          value: Math.round(totalPriceApplyDiscount / 23500)
        },
        shipping: {
          currency_code: 'USD',
          value: shippingFee
        }
      }
    }
  })
}

const capturePayPalOrder = async ({ userId, paypalOrderId, orderProducts }) => {
  try {
    const paypalOrderData = await paypalProvider.captureOrder(paypalOrderId)
    if (paypalOrderData.status === 'COMPLETED') {
      const { _id: newOrderId } = await order(userId, {
        orderProducts,
        paymentMethod: PAYMENT_METHODS.ONLINE_PAYMENT
      })
      await orderService.updateStatus({
        userId,
        orderId: newOrderId,
        status: ORDER_STATUSES.PAID
      })
      // save payment

      return paypalOrderData
    }
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Something went wrong')
  } catch (error) {
    if (error.name === ApiError.name) throw error
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Something went wrong'
    )
  }
}

const cancelOrder = async (userId, orderId) => {
  try {
    const updatedOrders = await orderModel.findByIdAndUpdate(
      { _id: orderId },
      {
        $set: { status: ORDER_STATUSES.CANCELED },
        $push: { statusHistory: { status: ORDER_STATUSES.CANCELED } }
      },
      { new: true }
    )
    if (!updatedOrders)
      throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found')
    return updatedOrders
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Cancel order failed')
  }
}

export default {
  review,
  order,
  createPayPalOrder,
  capturePayPalOrder,
  cancelOrder
}
