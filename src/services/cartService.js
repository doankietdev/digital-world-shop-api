import { StatusCodes } from 'http-status-codes'
import cartModel from '~/models/cartModel'
import productModel from '~/models/productModel'
import ApiError from '~/utils/ApiError'

/**
 * @param {object} data
 * @param {string} data.userId
 * @param {object} data.product
 * @param {string} data.product.productId
 * @param {string} data.product.quantity
 * @returns {object}
 */
const createNewCart = async ({ userId, product }) => {
  try {
    return await cartModel.findOneAndUpdate(
      { userId },
      { $addToSet: { products: product }, $set: { countProducts: product ? 1: 0 } },
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
 * @param {object} data
 * @param {string} data.userId
 * @param {object} data.product
 * @param {string} data.product.productId
 * @param {string} data.product.quantity
 * @returns {object}
 */
const updateProductQuantity = async ({ userId, product }) => {
  try {
    const { productId, quantity } = product
    return await cartModel.findOneAndUpdate(
      { userId, 'products.productId': productId },
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
 * @param {object} data
 * @param {string} data.userId
 * @param {object} data.product
 * @param {string} data.product.productId
 * @param {number} data.product.quantity
 * @returns {object}
 */
const addToCart = async ({ userId, product }) => {
  try {
    const { productId } = product || {}

    const [foundProduct, foundCart] = await Promise.all([
      await productModel.findById(productId).lean(),
      await cartModel.findOne({ userId })
    ])
    if (!foundProduct)
      throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')

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
      (product) => product.productId.toString() === productId
    )

    if (foundCartProduct) {
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
 * @param {object} data
 * @param {string} data.userId
 * @param {object} data.product
 * @param {string} data.product.productId
 * @param {number} data.product.quantity
 * @param {number} data.product.oldQuantity
 * @returns {object}
 */
const updateProductToCart = async ({ userId, product }) => {
  try {
    const { productId, quantity, oldQuantity } = product || {}
    const [foundProduct, foundCart] = await Promise.all([
      await productModel.findById(productId).lean(),
      await cartModel.findOne({ userId })
    ])

    if (!foundProduct)
      throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')

    if (!foundCart) {
      return await createNewCart({
        userId,
        product: {
          productId,
          quantity
        }
      })
    }

    const cartProduct = foundCart.products.find(
      (product) => product.productId.toString() === productId
    )
    if (!cartProduct)
      throw new ApiError(StatusCodes.NOT_FOUND, 'No products found in cart')
    if (cartProduct.quantity !== oldQuantity)
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid "oldQuantity"')

    if (quantity === 0) {
      return deleteFromCart({ userId, productId })
    }

    return await updateProductQuantity({
      userId,
      product: {
        productId,
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

const deleteFromCart = async ({ userId, productId }) => {
  try {
    const { acknowledged } = await cartModel.updateOne(
      { userId },
      { $pull: { products: { productId } }, $inc: { countProducts: -1 } }
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
  deleteFromCart,
  getCart
}
