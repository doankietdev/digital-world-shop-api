import { StatusCodes } from 'http-status-codes'
import userModel from '~/models/userModel'
import cloudinaryProvider from '~/providers/cloudinaryProvider'
import ApiError from '~/utils/ApiError'
import { parseQueryParams } from '~/utils/formatter'
import { calculateTotalPages } from '~/utils/util'

const getUser = async (userId, reqQuery) => {
  try {
    const { fields } = parseQueryParams(reqQuery)
    const foundUser = await userModel.findById(userId).select(fields)
    if (!foundUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Something went wrong')
    return {
      _id: foundUser._id,
      firstName: foundUser.firstName,
      lastName: foundUser.lastName,
      image: foundUser.image,
      email: foundUser.email,
      mobile: foundUser.mobile,
      addresses: foundUser.addresses,
      cart: foundUser.cart,
      wishlist: foundUser.wishlist,
      role: foundUser.role,
      createdAt: foundUser.createdAt,
      updatedAt: foundUser.updatedAt
    }
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Get user failed')
  }
}

const getCurrentUser = async (userId, reqQuery) => {
  try {
    const { fields } = parseQueryParams(reqQuery)
    const foundUser = await userModel.findById(userId).select(fields)
    if (!foundUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Something went wrong')
    return {
      _id: foundUser._id,
      firstName: foundUser.firstName,
      lastName: foundUser.lastName,
      image: foundUser.image,
      email: foundUser.email,
      mobile: foundUser.mobile,
      addresses: foundUser.addresses,
      cart: foundUser.cart,
      wishlist: foundUser.wishlist,
      createdAt: foundUser.createdAt,
      updatedAt: foundUser.updatedAt
    }
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Get current user failed')
  }
}

const getUsers = async (reqQuery) => {
  try {
    const { query, sort, fields, limit, skip, page } = parseQueryParams(reqQuery)

    const [users, totalUsers] = await Promise.all([
      userModel
        .find(query)
        .sort(sort)
        .select(fields)
        .skip(skip)
        .limit(limit),
      userModel.countDocuments()
    ])

    const responseUser = users.map(user => {
      return {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        email: user.email,
        mobile: user.mobile,
        addresses: user.addresses,
        cart: user.cart,
        wishlist: user.wishlist,
        isBlocked: user.isBlocked,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    })

    return {
      page,
      totalPages: calculateTotalPages(totalUsers, limit),
      totalUsers,
      users: responseUser
    }
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Get users failed')
  }
}

const updateCurrentUser = async (userId, reqFile, reqBody) => {
  try {
    const prevUser = await userModel.findById(userId)
    if (!prevUser) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')

    let image = undefined
    if (reqFile) {
      [image] = await Promise.all([
        cloudinaryProvider.uploadSingle(reqFile),
        cloudinaryProvider.deleteSingle(prevUser.image.id)
      ])
    }

    const user = await userModel.findByIdAndUpdate(
      userId,
      { ...reqBody, image },
      { new: true }
    )
    if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'Something went wrong')
    return {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      image: user.image,
      email: user.email,
      mobile: user.mobile,
      addresses: user.addresses,
      cart: user.cart,
      wishlist: user.wishlist
    }
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Update current user failed')
  }
}

const updateUser = async (userId, reqFile, reqBody) => {
  try {
    const prevUser = await userModel.findById(userId)
    if (!prevUser) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')

    let image = undefined
    if (reqFile) {
      [image] = await Promise.all([
        cloudinaryProvider.uploadSingle(reqFile),
        cloudinaryProvider.deleteSingle(prevUser.image.id)
      ])
    }

    const user = await userModel.findByIdAndUpdate(
      userId,
      { ...reqBody, image },
      { new: true }
    )
    if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')

    return {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      image: user.image,
      email: user.email,
      mobile: user.mobile,
      addresses: user.addresses,
      cart: user.cart,
      wishlist: user.wishlist,
      isBlocked: user.isBlocked,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Update user failed')
  }
}

const deleteUser = async(userId) => {
  try {
    const user = await userModel.findByIdAndDelete(userId)
    if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    await cloudinaryProvider.deleteSingle(user.image.id)
    return {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      image: user.image,
      email: user.email,
      mobile: user.mobile,
      addresses: user.addresses,
      isBlocked: user.isBlocked,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Delete user failed')
  }
}

const setBlocked = async(userId, blocked) => {
  try {
    const user = await userModel.findByIdAndUpdate(
      userId,
      { isBlocked: blocked },
      { new: true }
    )
    if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    return {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobile: user.mobile,
      addresses: user.addresses,
      isBlocked: user.isBlocked,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Set blocked failed')
  }
}

const addProductToCart = async (userId, reqBody) => {
  try {
    const foundUser = await userModel.findById(userId)
    if (!foundUser) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    const isExist = foundUser.cart.some(
      productInCart => productInCart.product?.equals(reqBody.productId)
    )

    let user = null
    if (isExist) {
      user = await userModel.findOneAndUpdate(
        { _id: userId, 'cart.product': reqBody.productId },
        { $inc: { 'cart.$.quantity': reqBody.quantity } },
        { new: true }
      )
    } else {
      user = await userModel.findByIdAndUpdate(
        userId,
        { $push: { cart: { product: reqBody.productId, quantity: reqBody.quantity } } },
        { new: true }
      )
    }

    if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    return user.cart
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Add product to cart failed')
  }
}

const reduceProductFromCart = async (userId, reqBody) => {
  try {
    const { productId, quantity } = reqBody || {}
    const foundUser = await userModel.findOne({
      _id: userId,
      'cart.product': productId
    })
    if (!foundUser) throw new ApiError(StatusCodes.NOT_FOUND, 'No product found in cart')

    const productToReduce = foundUser.cart?.find(
      productInCart => productInCart?.product.equals(productId)
    )
    const restQuantity = productToReduce.quantity - quantity

    if (restQuantity < 0)
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Exceeded allowed quantity')

    let user = null
    if (restQuantity === 0) {
      user = await userModel.findByIdAndUpdate(
        userId,
        { $pull: { cart: { product: productId } } },
        { new: true }
      )
    } else {
      user = await userModel.findOneAndUpdate(
        { _id: userId, 'cart.product': reqBody.productId },
        { $inc: { 'cart.$.quantity': -reqBody.quantity } },
        { new: true }
      )
    }
    return user.cart
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Add product to cart failed')
  }
}

const deleteProductFromCart = async (userId, reqBody) => {
  try {
    const { productId } = reqBody || {}
    const user = await userModel.findOneAndUpdate(
      { _id: userId, 'cart.product': productId },
      { $pull: { cart: { product: productId } } },
      { new: true }
    )
    if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'No product found in cart')
    return user.cart
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Delete product from cart failed')
  }
}

export default {
  getUser,
  getCurrentUser,
  getUsers,
  updateCurrentUser,
  updateUser,
  deleteUser,
  setBlocked,
  addProductToCart,
  reduceProductFromCart,
  deleteProductFromCart
}