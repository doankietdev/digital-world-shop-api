import productModel from '~/models/productModel'
import discountRepo from '~/repositories/discountRepo'
import { DISCOUNT_APPLY_TYPES, DISCOUNT_TYPES } from '~/utils/constants'
import { getObjectByFields } from '~/utils/util'

/**
 * @param {{
 *  productId: String,
 *  quantity: Number
 *  variantId: String
 * }[]} orderProducts
 */
const checkProductsAvailable = async (orderProducts) => {
  return await Promise.all(
    orderProducts.map(async (orderProduct) => {
      const foundProduct = await productModel.findById(orderProduct.productId)
      if (!foundProduct) return null
      const variant = foundProduct.variants.find((variant) =>
        variant._id.equals(orderProduct.variantId)
      )
      if (!variant) return null
      const isExceedQuantity = orderProduct.quantity > variant.quantity
      if (isExceedQuantity) return null
      return {
        productId: foundProduct._id,
        variantId: variant._id,
        price: foundProduct.price,
        quantity: variant.quantity
      }
    })
  )
}

const getProductsApplyDiscount = async (products = []) => {
  const productIds = products.map((product) => product._id)

  const discounts = await discountRepo.findByProductIds(productIds, {
    currentUsage: 0,
    maxUsage: 0,
    isActive: 0,
    createdAt: 0,
    updatedAt: 0
  })

  return products.map((product) => {
    const separateDiscounts = discounts.filter(
      (discount) =>
        discount.products?.find((productId) => productId.equals(product?._id)) ||
        discount.applyFor === DISCOUNT_APPLY_TYPES.ALL
    )

    const { totalPercentage, totalFixed } = separateDiscounts.reduce(
      (acc, discount) => {
        if (discount.type === DISCOUNT_TYPES.PERCENTAGE) {
          acc.totalPercentage += discount.value
        } else if (discount.type === DISCOUNT_TYPES.FIXED) {
          acc.totalFixed += discount.value
        }
        return acc
      },
      { totalPercentage: 0, totalFixed: 0 }
    )

    let priceApplyDiscount =
      product.price - totalFixed - (product.price * totalPercentage) / 100
    if (priceApplyDiscount < 0) priceApplyDiscount = 0

    const fields = [
      '_id',
      'title',
      'slug',
      'brand',
      'variants'
    ]
    return {
      ...getObjectByFields(product.toObject(), fields),
      oldPrice: separateDiscounts.length ? product.price : null,
      price: separateDiscounts.length ? priceApplyDiscount : product.price,
      discounts: separateDiscounts.map((discount) => ({
        ...discount,
        products: undefined
      }))
    }
  })
}

export default {
  checkProductsAvailable,
  getProductsApplyDiscount
}
