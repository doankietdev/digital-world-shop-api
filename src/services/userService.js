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

export default {
  getUser,
  getCurrentUser,
  getUsers,
  updateCurrentUser,
  updateUser,
  deleteUser,
  setBlocked
}