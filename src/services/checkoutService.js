import { StatusCodes } from 'http-status-codes'
import { connectDB } from '~/configs/mongodb'
import orderModel from '~/models/orderModel'
import productModel from '~/models/productModel'
import userModel from '~/models/userModel'
import momoProvider from '~/providers/momoProvider'
import paypalProvider from '~/providers/paypalProvider'
import checkoutRepo from '~/repositories/checkoutRepo'
import ApiError from '~/utils/ApiError'
import { ORDER_STATUSES, PAYMENT_METHODS, TRANSACTION_STATUS } from '~/utils/constants'
import { convertCurrency } from '~/utils/util'
import currencyService from './currencyService'
import orderService from './orderService'
import userService from './userService'
import transactionService from './transactionService'

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
 *  shippingFee: number,
 *  totalWeight: number}>}
 */
const review = async (userId, reqBody) => {
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
        $in: orderProducts.map(orderProduct => orderProduct.productId)
      }
    })
    .lean()
  const productsApplyDiscount = await checkoutRepo.getProductsApplyDiscount(
    foundProducts
  )

  const isValidOrder = orderProducts.some(orderProduct => {
    productsApplyDiscount.some(productApplyDiscount => {
      if (productApplyDiscount.oldPrice !== orderProduct.oldPrice)
        return false
      if (productApplyDiscount.price !== orderProduct.price) {
        return false
      }
      return true
    })
    const product = productsApplyDiscount.find(product =>
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
  const responseOrderProducts = orderProducts.map(orderProduct => {
    const productApplyDiscount = productsApplyDiscount.find(
      productApplyDiscount =>
        productApplyDiscount._id.equals(orderProduct.productId)
    )

    const weight = productApplyDiscount.specs.find(
      spec => spec.k === 'weight'
    )
    if (weight) totalWeight = totalWeight + weight.v * orderProduct.quantity

    return {
      product: {
        ...productApplyDiscount,
        variant: {
          ...productApplyDiscount.variants?.find(
            variant => variant?._id.toString() === orderProduct.variantId
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
  if (foundUser.defaultAddress) {
    // const { total: shippingFee } = await ghnAxiosClient.post(
    //   PARTNER_APIS.GHN.APIS.CALCULATE_FEE,
    //   {
    //     to_ward_code: foundUser.defaultAddress.wardCode,
    //     to_district_id: foundUser.defaultAddress.districtId,
    //     weight: totalWeight,
    //     service_id: PARTNER_APIS.GHN.SERVICE_ID,
    //     service_type_id: PARTNER_APIS.GHN.SERVICE_TYPE_ID
    //   }
    // )
    const shippingFee = 0
    reviewInfo = {
      ...reviewInfo,
      shippingFee,
      totalPayment: shippingFee + reviewInfo.totalPriceApplyDiscount
    }
  }

  return {
    ...reviewInfo,
    totalWeight
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
  const session = await (await connectDB()).startSession()
  session.startTransaction()

  try {
    const { paymentMethod } = reqBody

    const foundUser = await userModel.findOne({
      _id: userId
    })
    if (!foundUser) throw new Error('User not found')

    if (!foundUser.defaultAddress)
      throw new ApiError(StatusCodes.BAD_REQUEST, 'User has not set a default address')

    const { shippingFee, orderProducts } = await review(userId, reqBody)

    const updateStockQuantityPromises = reqBody.orderProducts?.map(
      ({ productId, variantId, quantity }) => productModel.findOneAndUpdate(
        { _id: productId, 'variants._id': variantId },
        { $inc: { 'variants.$.quantity': -quantity } }
      )
    )
    await Promise.all(updateStockQuantityPromises)

    const newOrder = await orderModel.create({
      products: orderProducts.map(({ product, quantity }) => ({
        product: product._id,
        variant: product.variant._id,
        quantity,
        oldPrice: product.oldPrice,
        price: product.price
      })),
      shippingAddress: foundUser.defaultAddress,
      shippingFee: shippingFee ?? 0,
      paymentMethod,
      user: foundUser._id
    })
    // cartService.deleteFromCart({
    //   userId,
    //   products: reqBody.orderProducts.map(orderProduct => ({
    //     productId: orderProduct.productId,
    //     variantId: orderProduct.variantId
    //   }))
    // }).then().catch(() => {})

    await session.commitTransaction()
    return newOrder
  } catch (error) {
    await session.abortTransaction()
    throw error
  } finally {
    session.endSession()
  }
}

const createPayPalOrder = async (userId, reqBody) => {
  const [
    { shippingFee = 0, totalPriceApplyDiscount, totalPayment, orderProducts }
    // { firstName, lastName, email, defaultAddress }
  ] = await Promise.all([
    review(userId, reqBody),
    userService.getUser(userId)
  ])

  return await paypalProvider.createOrder({
    items: orderProducts.map((orderProduct) => ({
      name: orderProduct.product.title,
      quantity: orderProduct.quantity,
      unit_amount: {
        currency_code: 'USD',
        value: orderProduct.product.price
      }
    })),
    amount: {
      currency_code: 'USD',
      value: totalPayment,
      breakdown: {
        item_total: {
          currency_code: 'USD',
          value: totalPriceApplyDiscount
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
}

const initMomoPayment = async (userId, reqBody) => {
  const newOrder = await order(userId, reqBody)
  const fullOrder = await orderService.getOrderOfCurrentUser(userId, newOrder._id)

  const currency = 'VND'
  const exchangeRate = await currencyService.getExchangeRate(currency)
  if (!exchangeRate) throw new Error('Exchange rate not found')

  return await momoProvider.initPayment({
    orderId: newOrder._id.toString(),
    items: fullOrder.products.map(({ product, variant, quantity, price }) => {
      const vndPrice = convertCurrency(price, exchangeRate)
      return {
        id: product._id,
        name: `${product.title} | ${variant.name}`,
        imageUrl: product.thumb?.url,
        price: vndPrice,
        currency,
        quantity,
        totalPrice: vndPrice * quantity
      }
    }),
    amount: fullOrder.totalPayment,
    taxAmount: fullOrder.shippingFee,
    orderInfo: `${fullOrder._id}`,
    extraData: { userId }
  })
}

const callbackMomo = async (payload) => {
  const {
    orderId,
    amount,
    resultCode,
    extraData,
    transId
  } = payload

  const foundOrder = orderService.getById(orderId)
  if (!foundOrder) throw new ApiError(StatusCodes.BAD_REQUEST, 'Order not found')

  if (resultCode !== 0) {
    return
  }

  // const isValidSignature = momoProvider.verifySignature(signature, {
  //   orderId,
  //   amount,
  //   extraData,
  //   orderInfo,
  //   requestId
  // })
  // if (!isValidSignature) throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid signature')

  const originalExtraData = Buffer.from(extraData, 'base64').toString('ascii')
  const { userId } = JSON.parse(originalExtraData) || {}
  if (!userId) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Missing userId in extraData')
  }

  transactionService.createNew({
    userId,
    orderId,
    paymentMethod: PAYMENT_METHODS.MOMO,
    amount,
    status: TRANSACTION_STATUS.COMPLETED,
    referenceId: transId
  })
  await orderService.updateStatusById(orderId, ORDER_STATUSES.PAID)
}

const cancelOrder = async (userId, orderId) => {
  const session = await (await connectDB()).startSession()
  session.startTransaction()

  try {
    const foundOrder = await orderModel.findOne({
      _id: orderId
    })
    if (!foundOrder) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found')
    }

    if (
      foundOrder.status !== ORDER_STATUSES.PENDING
    ) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Cannot cancel order')
    }

    const { modifiedCount } = await orderModel.updateOne(
      { _id: orderId },
      {
        $set: { status: ORDER_STATUSES.CANCELED },
        $push: { statusHistory: { status: ORDER_STATUSES.CANCELED } }
      }
    )
    if (!modifiedCount === 0) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Cannot cancel order')
    }

    const updateStockQuantityPromises = foundOrder.products?.map(
      ({ product, variant, quantity }) => productModel.findOneAndUpdate(
        { _id: product, 'variants._id': variant },
        { $inc: { 'variants.$.quantity': quantity } }
      )
    )
    await Promise.all(updateStockQuantityPromises)

    await session.commitTransaction()
    return await orderService.getOrderOfCurrentUser(userId, orderId)
  } catch (error) {
    await session.abortTransaction()
    throw error
  } finally {
    session.endSession()
  }
}

export default {
  review,
  order,
  createPayPalOrder,
  capturePayPalOrder,
  initMomoPayment,
  callbackMomo,
  cancelOrder
}
