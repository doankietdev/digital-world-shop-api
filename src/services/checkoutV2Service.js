import { StatusCodes } from 'http-status-codes'
import productModel from '~/models/productModel'
import userModel from '~/models/userModel'
import checkoutRepo from '~/repositories/checkoutRepo'
import ApiError from '~/utils/ApiError'
import { convertCurrency } from '~/utils/util'
import currencyService from './currencyService'

/**
 * @param {*} userId
 * @param {*} reqBody
 * @param {string} currency
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
const review = async (userId, reqBody, currency) => {
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
  const exchangeRate = await currencyService.getExchangeRate(currency)
  const responseOrderProducts = orderProducts.map(orderProduct => {
    let productApplyDiscount = productsApplyDiscount.find(
      productApplyDiscount =>
        productApplyDiscount._id.equals(orderProduct.productId)
    )

    if (exchangeRate) {
      productApplyDiscount = {
        ...productApplyDiscount,
        price: convertCurrency(productApplyDiscount.price, exchangeRate),
        oldPrice: convertCurrency(productApplyDiscount.oldPrice, exchangeRate),
        basePrice: productApplyDiscount.price,
        baseOldPrice: productApplyDiscount.oldPrice
      }
    } else {
      productApplyDiscount = {
        ...productApplyDiscount,
        basePrice: productApplyDiscount.price,
        baseOldPrice: productApplyDiscount.oldPrice
      }
    }

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

export default {
  review
}
