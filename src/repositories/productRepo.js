import { StatusCodes } from 'http-status-codes'
import productModel from '~/models/productModel'
import discountRepo from '~/repositories/discountRepo'
import ApiError from '~/utils/ApiError'
import { DISCOUNT_APPLY_TYPES, DISCOUNT_TYPES } from '~/utils/constants'

const getProductApplyDiscount = async (productId, queryParams = {}) => {
  const { fields } = queryParams
  const [product, discounts] = await Promise.all([
    productModel
      .findById(productId)
      .populate('category', '-createdAt -updatedAt')
      .select(fields),
    discountRepo.findByProductIds([productId], {
      products: 0,
      currentUsage: 0,
      maxUsage: 0,
      isActive: 0,
      createdAt: 0,
      updatedAt: 0
    })
  ])
  if (!product) throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')

  const { totalPercentage, totalFixed } = discounts.reduce(
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

  return {
    ...product.toObject(),
    oldPrice: discounts.length ? product.price : null,
    price: discounts.length ? priceApplyDiscount : product.price,
    discounts
  }
}

const convertToProductsApplyDiscount = async (products = []) => {
  const productIds = products.map((product) => product._id)

  const discounts = await discountRepo.findByProductIds(productIds, {
    currentUsage: 0,
    maxUsage: 0,
    isActive: 0,
    createdAt: 0,
    updatedAt: 0
  })

  return products.map((product) => {
    const separateDiscounts = discounts.filter((discount) => {
      return (
        discount.products?.find((productId) => {
          return productId.equals(product?._id)
        }) || discount.applyFor === DISCOUNT_APPLY_TYPES.ALL
      )
    })

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

    let priceApplyDiscount = Math.round(
      product.price - totalFixed - (product.price * totalPercentage) / 100
    )
    if (priceApplyDiscount < 0) priceApplyDiscount = 0

    return {
      ...product.toObject(),
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
  getProductApplyDiscount,
  convertToProductsApplyDiscount
}
