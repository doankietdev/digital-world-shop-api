import productModel from '~/models/productModel'

/**
 * @param {{
 *  productId: String,
 *  quantity: Number
 * }[]} orderProducts
 */
const checkProductsAvailable = async (orderProducts) => {
  return await Promise.all(
    orderProducts.map(async (orderProduct) => {
      const foundProduct = await productModel.findById(orderProduct.productId)
      if (!foundProduct) return null
      const isExceedQuantity = orderProduct.quantity > foundProduct.quantity
      if (isExceedQuantity) return null
      return {
        productId: foundProduct._id,
        price: foundProduct.price,
        quantity: orderProduct.quantity
      }
    })
  )
}

export default {
  checkProductsAvailable
}