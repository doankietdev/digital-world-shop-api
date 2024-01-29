import { StatusCodes } from 'http-status-codes'
import userModel from '~/models/userModel'
import ApiError from '~/utils/ApiError'

const getCurrent = async (userId) => {
  const foundUser = await userModel.findById(userId)
  if (!foundUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Something went wrong')
  return {
    _id: foundUser._id,
    firstName: foundUser.firstName,
    lastName: foundUser.lastName,
    email: foundUser.email,
    mobile: foundUser.mobile,
    address: foundUser.address,
    cart: foundUser.cart,
    wishlist: foundUser.wishlist
  }
}

const getAll = async () => {
  const users = await userModel.find()
  return users.map(user => {
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
  getCurrent,
  getAll,
  updateCurrent,
  updateUser,
  deleteUser,
  setBlocked
}