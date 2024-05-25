import { StatusCodes } from 'http-status-codes'
import cartModel from '~/models/cartModel'
import checkoutRepo from '~/repositories/checkoutRepo'
import ApiError from '~/utils/ApiError'
import productService from './productService'

/**
 * @param {{
 *   userId: string,
 *   product: {
 *     productId: string,
 *     variantId: string,
 *     quantity: number
 *   }
 * }}
 * @returns {object}
 */
const createNewCart = async ({ userId, product }) => {
  try {
    return await cartModel.findOneAndUpdate(
      { userId },
      {
        $addToSet: { products: product },
        $set: { countProducts: product ? 1 : 0 }
      },
      { upsert: true, new: true }
    )
  } catch (error) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Something went wrong'
    )
  }
}

/**
 * @param {{
 *   userId: string,
 *   product: {
 *     productId: string,
 *     variantId: string,
 *     quantity: number
 *   }
 * }}
 * @returns {object}
 */
const updateProductQuantity = async ({ userId, product }) => {
  try {
    const { productId, variantId, quantity } = product
    return await cartModel.findOneAndUpdate(
      {
        userId,
        'products.productId': productId,
        'products.variantId': variantId
      },
      { $inc: { 'products.$.quantity': quantity } },
      { new: true }
    )
  } catch (error) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Something went wrong'
    )
  }
}

/**
 * @param {{
 *   userId: string,
 *   product: {
 *     productId: string,
 *     variantId: string,
 *     quantity: number
 *   }
 * }}
 * @returns {object}
 */
const addToCart = async ({ userId, product }) => {
  try {
    const { productId, variantId } = product || {}

    const checkedProducts = await checkoutRepo.checkProductsAvailable([product])
    const hasOrderProductExceedQuantity = checkedProducts.includes(null)
    if (hasOrderProductExceedQuantity)
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Product not available')

    const foundCart = await cartModel.findOne({ userId })
    if (!foundCart) {
      return await createNewCart({
        userId,
        product
      })
    }

    if (!foundCart.products.length) {
      foundCart.products = [product]
      foundCart.countProducts = 1
      return await foundCart.save()
    }

    const foundCartProduct = foundCart.products.find(
      (product) =>
        product.productId.toString() === productId &&
        product.variantId.toString() === variantId
    )

    if (foundCartProduct) {
      const checkedProducts = await checkoutRepo.checkProductsAvailable([
        {
          ...product,
          quantity: product.quantity + foundCartProduct.quantity
        }
      ])
      const hasOrderProductExceedQuantity = checkedProducts.includes(null)
      if (hasOrderProductExceedQuantity)
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          'The quantity you selected has reached the maximum capacity for this product'
        )

      return await updateProductQuantity({ userId, product })
    }

    return await cartModel
      .findOneAndUpdate(
        { userId },
        { $addToSet: { products: product }, $inc: { countProducts: 1 } },
        { new: true }
      )
      .lean()
  } catch (error) {
    if (error.name === ApiError.name) throw error
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Add product to cart failed'
    )
  }
}

/**
 * @param {{
 *   userId: string,
 *   product: {
 *     productId: string,
 *     variantId: string,
 *     quantity: number,
 *     oldQuantity: number
 *   }
 * }}
 * @returns {object}
 */
const updateProductToCart = async ({ userId, product }) => {
  try {
    const { productId, variantId, quantity, oldQuantity } = product || {}

    if (quantity === 0) {
      return await deleteFromCart({ userId, productId, variantId })
    }

    const foundCart = await cartModel.findOne({ userId })
    if (!foundCart) {
      const checkedProducts = await checkoutRepo.checkProductsAvailable([
        product
      ])
      const hasOrderProductExceedQuantity = checkedProducts.includes(null)
      if (hasOrderProductExceedQuantity)
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Product not available')

      return await createNewCart({
        userId,
        product: {
          productId,
          variantId,
          quantity
        }
      })
    }

    const cartProduct = foundCart.products.find(
      (product) =>
        product.productId.toString() === productId &&
        product.variantId.toString() === variantId
    )
    if (!cartProduct)
      throw new ApiError(StatusCodes.NOT_FOUND, 'No products found in cart')
    if (cartProduct.quantity !== oldQuantity)
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid "oldQuantity"')

    const checkedProducts = await checkoutRepo.checkProductsAvailable([
      {
        ...product,
        quantity: quantity - oldQuantity + cartProduct.quantity
      }
    ])
    const hasOrderProductExceedQuantity = checkedProducts.includes(null)
    if (hasOrderProductExceedQuantity)
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Product not available')

    return await updateProductQuantity({
      userId,
      product: {
        productId,
        variantId,
        quantity: quantity - oldQuantity
      }
    })
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Add product to cart failed'
    )
  }
}

/**
 * @param {{
*   userId: string,
*   product: {
*     productId: string,
*     oldVariantId: string,
*     variantId: string,
*   }
* }}
* @returns {object}
*/
const updateVariantToCart = async ({ userId, product }) => {
  try {
    const { productId, oldVariantId, variantId } = product || {}

    const foundCart = await cartModel.findOne({ userId })
    if (!foundCart) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Cart not found')
    }

    const cartProduct = foundCart.products.find(
      (product) =>
        product.productId.toString() === productId &&
        product.variantId.toString() === oldVariantId
    )
    if (!cartProduct)
      throw new ApiError(StatusCodes.NOT_FOUND, 'No products found in cart')

    const checkedProducts = await checkoutRepo.checkProductsAvailable([
      {
        ...product,
        quantity: cartProduct.quantity
      }
    ])
    const hasOrderProductExceedQuantity = checkedProducts.includes(null)
    if (hasOrderProductExceedQuantity)
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Product not available')

    const updatedCart = await cartModel.findOneAndUpdate(
      {
        userId,
        'products.productId': productId,
        'products.variantId': oldVariantId
      },
      { $set: { 'products.$.variantId': variantId } }
    )
    if (!updatedCart) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Update variant failed')
    }

    return await getCart({ userId })
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Add product to cart failed'
    )
  }
}

const deleteFromCart = async ({ userId, productId, variantId }) => {
  try {
    const { acknowledged } = await cartModel.updateOne(
      { userId },
      {
        $pull: { products: { productId, variantId } },
        $inc: { countProducts: -1 }
      }
    )
    if (!acknowledged)
      throw new ApiError(StatusCodes.NOT_FOUND, 'No products found in cart')
  } catch (error) {
    if (error.name === ApiError.name) throw error
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Something went wrong'
    )
  }
}

const getCart = async ({ userId }) => {
  try {
    const cart = await cartModel.findOne({ userId }).lean()
    if (!cart) throw new ApiError(StatusCodes.NOT_FOUND, 'Cart not found')

    for (const cartProduct of cart.products) {
      cartProduct.product = await productService.getProduct(cartProduct.productId)
      delete cartProduct.productId
    }

    return cart
  } catch (error) {
    if (error.name === ApiError.name) throw error
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Something went wrong'
    )
  }
}

export default {
  createNewCart,
  addToCart,
  updateProductToCart,
  updateVariantToCart,
  deleteFromCart,
  getCart
}
