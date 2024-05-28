import { StatusCodes } from 'http-status-codes'
import addressModel from '~/models/addressModel'
import orderModel from '~/models/orderModel'
import productModel from '~/models/productModel'
import checkoutRepo from '~/repositories/checkoutRepo'
import ApiError from '~/utils/ApiError'
import { ORDER_STATUSES } from '~/utils/constants'

const review = async (reqBody) => {
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

    const responseOrderProducts = orderProducts.map((orderProduct) => {
      const productApplyDiscount = productsApplyDiscount.find(
        (productApplyDiscount) =>
          productApplyDiscount._id.equals(orderProduct.productId)
      )
      return {
        product: {
          ...productApplyDiscount,
          variants: undefined,
          variant: {
            ...productApplyDiscount.variants?.find(
              (variant) => variant?._id === orderProduct.variantId
            ),
            quantity: undefined
          }
        },
        quantity: orderProduct.quantity,
        totalPrice: productApplyDiscount.oldPrice * orderProduct.quantity,
        totalPriceApplyDiscount:
          productApplyDiscount.price * orderProduct.quantity
      }
    })

    return {
      orderProducts: responseOrderProducts,
      totalPrice: responseOrderProducts.reduce(
        (acc, orderProduct) => (acc += orderProduct.totalPrice),
        0
      ),
      totalPriceApplyDiscount: responseOrderProducts.reduce(
        (acc, orderProduct) => (acc += orderProduct.totalPriceApplyDiscount),
        0
      )
    }
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Get order review failed'
    )
  }
}

const order = async (userId, reqBody) => {
  try {
    const { orderProducts, shippingAddressId } = reqBody || {}
    const checkedProducts = await checkoutRepo.checkProductsAvailable(
      orderProducts
    )
    const hasOrderProductExceedQuantity = checkedProducts.includes(null)
    if (hasOrderProductExceedQuantity)
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Order wrong')

    const foundProducts = await productModel.find({
      _id: { $in: orderProducts.map((orderProduct) => orderProduct.productId) }
    })
    const productsApplyDiscount = await checkoutRepo.getProductsApplyDiscount(
      foundProducts
    )

    let isValidOrder = orderProducts.some((orderProduct) =>
      productsApplyDiscount.some((productApplyDiscount) => {
        if (productApplyDiscount.oldPrice !== orderProduct.oldPrice)
          return false
        if (productApplyDiscount.price !== orderProduct.price) return false
        if (
          !orderProduct.discountCodes?.length ||
          !productApplyDiscount.discounts?.length
        )
          return true
        const isValidAllDiscount = productApplyDiscount.discounts?.every(
          (discount) => orderProduct.discountCodes?.includes(discount.code)
        )
        if (isValidAllDiscount) return true
        return false
      })
    )
    if (!addressModel.findById(shippingAddressId)) {
      isValidOrder = false
    }
    if (!isValidOrder)
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Order wrong')

    const savedOrderProducts = productsApplyDiscount.map(
      (productApplyDiscount) => {
        const correspondOrderProduct = orderProducts.find((orderProduct) =>
          productApplyDiscount?._id?.equals(orderProduct.productId)
        )
        return {
          productId: productApplyDiscount._id,
          variantId: productApplyDiscount.variants?.find((variant) =>
            variant?._id?.equals(correspondOrderProduct.variantId)
          )?._id,
          quantity: correspondOrderProduct.quantity,
          totalPrice:
            productApplyDiscount.oldPrice * correspondOrderProduct.quantity,
          totalPriceApplyDiscount:
            productApplyDiscount.price * correspondOrderProduct.quantity
        }
      }
    )

    const order = {
      orderBy: userId,
      shippingAddress: shippingAddressId,
      statusHistory: [{ status: ORDER_STATUSES.PENDING }],
      orderProducts: savedOrderProducts,
      totalPrice: savedOrderProducts.reduce(
        (acc, orderProduct) => (acc += orderProduct.totalPrice),
        0
      ),
      totalPriceApplyDiscount: savedOrderProducts.reduce(
        (acc, orderProduct) => (acc += orderProduct.totalPriceApplyDiscount),
        0
      )
    }

    return (await orderModel.create(order)).toObject()
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Order failed')
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
  cancelOrder
}
