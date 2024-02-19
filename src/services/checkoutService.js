import { StatusCodes } from 'http-status-codes'
import productModel from '~/models/productModel'
import checkoutRepo from '~/repositories/checkoutRepo'
import productRepo from '~/repositories/productRepo'
import ApiError from '~/utils/ApiError'

/*
  orderProducts: [
    {
      productId,
      oldPrice,
      price,
      quantity,
      discountCodes: ['code1', 'code2']
    }
  ]
*/
const review = async (reqBody) => {
  try {
    const { orderProducts } = reqBody || {}
    // totalPrice, addressId, paymentMethod
    const checkedProducts = await checkoutRepo.checkProductsAvailable(orderProducts)
    const hasOrderProductExceedQuantity = checkedProducts.includes(null)
    if (hasOrderProductExceedQuantity)
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Order wrong')

    const foundProducts = await productModel.find({
      _id: { $in: orderProducts.map((orderProduct) => orderProduct.productId) }
    })
    const productsApplyDiscount = await productRepo.convertToProductsApplyDiscount(
      foundProducts
    )

    const isValidOrder = orderProducts.some(orderProduct =>
      productsApplyDiscount.some(productApplyDiscount => {
        if (productApplyDiscount.oldPrice != orderProduct.oldPrice) return false
        if (!orderProduct.discountCodes?.length || !productApplyDiscount.discounts?.length)
          return true
        const isValidAllDiscount = productApplyDiscount.discounts?.every(
          discount => orderProduct.discountCodes?.includes(discount.code)
        )
        if (isValidAllDiscount) return true
        return false
      })
    )
    if (!isValidOrder) throw new ApiError(StatusCodes.BAD_REQUEST, 'Order wrong')

    return {
      orderProducts: productsApplyDiscount,
      totalPrice: productsApplyDiscount.reduce((acc, product) => acc += product.price, 0)
    }
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Get order review failed')
  }
}

export default {
  review
}
