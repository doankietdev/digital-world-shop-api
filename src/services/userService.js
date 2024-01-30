import { StatusCodes } from 'http-status-codes'
import userModel from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import { parseQueryParams } from '~/utils/formatter'
import { calculateTotalPages } from '~/utils/util'

const getUser = async (userId, reqQuery) => {
  const { fields } = parseQueryParams(reqQuery)
  const foundUser = await userModel.findById(userId).select(fields)
  if (!foundUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Something went wrong')
  return {
    _id: foundUser._id,
    firstName: foundUser.firstName,
    lastName: foundUser.lastName,
    email: foundUser.email,
    mobile: foundUser.mobile,
    address: foundUser.address,
    cart: foundUser.cart,
    wishlist: foundUser.wishlist,
    role: foundUser.role,
    createdAt: foundUser.createdAt,
    updatedAt: foundUser.updatedAt
  }
}

const getCurrent = async (userId, reqQuery) => {
  const { fields } = parseQueryParams(reqQuery)
  const foundUser = await userModel.findById(userId).select(fields)
  if (!foundUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Something went wrong')
  return {
    _id: foundUser._id,
    firstName: foundUser.firstName,
    lastName: foundUser.lastName,
    email: foundUser.email,
    mobile: foundUser.mobile,
    address: foundUser.address,
    cart: foundUser.cart,
    wishlist: foundUser.wishlist,
    createdAt: foundUser.createdAt,
    updatedAt: foundUser.updatedAt
  }
}

const getAll = async (reqQuery) => {
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
      email: user.email,
      mobile: user.mobile,
      address: user.address,
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
}

const updateCurrent = async (userId, {
  firstName,
  lastName,
  mobile,
  password,
  address
}) => {
  const user = await userModel.findByIdAndUpdate(
    userId,
    {
      firstName,
      lastName,
      mobile,
      password,
      address
    },
    { new: true }
  )
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'Something went wrong')
  return {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    mobile: user.mobile,
    address: user.address,
    cart: user.cart,
    wishlist: user.wishlist
  }
}

const updateUser = async (userId, {
  firstName,
  lastName,
  mobile,
  password,
  address,
  role
}) => {
  const user = await userModel.findByIdAndUpdate(
    userId,
    {
      firstName,
      lastName,
      mobile,
      password,
      address,
      role
    },
    { new: true }
  )
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
  return {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    mobile: user.mobile,
    address: user.address,
    cart: user.cart,
    wishlist: user.wishlist,
    isBlocked: user.isBlocked,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  }
}

const deleteUser = async(userId) => {
  const user = await userModel.findByIdAndDelete(userId)
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
  return {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    mobile: user.mobile,
    address: user.address,
    isBlocked: user.isBlocked,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  }
}

const setBlocked = async(userId, blocked) => {
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
    address: user.address,
    isBlocked: user.isBlocked,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  }
}

export default {
  getUser,
  getCurrent,
  getAll,
  updateCurrent,
  updateUser,
  deleteUser,
  setBlocked
}