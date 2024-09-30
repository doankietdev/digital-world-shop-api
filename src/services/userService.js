import { StatusCodes } from 'http-status-codes'
import cloudinary from '~/configs/cloudinary'
import addressModel from '~/models/addressModel'
import userModel from '~/models/userModel'
import cloudinaryProvider from '~/providers/cloudinaryProvider'
import ApiError from '~/utils/ApiError'
import { parseQueryParams } from '~/utils/formatter'
import { calculateTotalPages } from '~/utils/util'
import { checkNewPasswordPolicy, hash, verifyHashed } from '~/utils/auth'
import addressService from './addressService'

const getUser = async (userId) => {
  try {
    const { items: [foundUser] } = await getUsers({ _id: userId })
    if (!foundUser)
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    return foundUser
  } catch (error) {
    if (error.name === ApiError.name) throw error
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Something went wrong'
    )
  }
}

const getUsers = async (reqQuery) => {
  try {
    const { query, sort, limit, skip, page } =
      parseQueryParams(reqQuery)

    const [users, totalUsers] = await Promise.all([
      userModel
        .find(query)
        .select({
          verificationToken: 0,
          passwordResetOTP: 0,
          passwordResetToken: 0,
          passwordHistory: 0,
          defaultAddress: 0,
          password: 0,
          publicKey: 0,
          privateKey: 0,
          accessTokens: 0,
          refreshTokens: 0,
          usedRefreshTokens: 0
        })
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      userModel.find(query).countDocuments()
    ])

    const attachedAddressesUser = await Promise.all(
      users.map(async (user) => ({
        ...user,
        addresses: await addressService.getUserAddresses({ userId: user._id })
      }))
    )

    return {
      page,
      totalPages: calculateTotalPages(totalUsers, limit),
      totalItems: totalUsers,
      items: attachedAddressesUser
    }
  } catch (error) {
    if (error.name === ApiError.name) throw error
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong')
  }
}

const updateUser = async (userId, reqBody) => {
  const user = await userModel.findOne({
    _id: userId
  })
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')

  const { modifiedCount } = await userModel.updateOne(
    { _id: userId },
    reqBody
  )
  if (!modifiedCount) throw new ApiError(StatusCodes.BAD_REQUEST, 'Update user failed')
  return await getUser(user._id)
}

const uploadAvatar = async (userId, avatar) => {
  try {
    const { path, filename } = avatar
    const prevUser = await userModel.findByIdAndUpdate(
      userId,
      { image: { url: path, id: filename } }
    )

    if (!prevUser) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')

    if (prevUser.image) {
      await cloudinary.uploader.destroy(prevUser.image.id)
    }

    return getUser(userId)
  } catch (error) {
    if (error.name === ApiError.name) throw error
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Something went wrong'
    )
  }
}

const changePassword = async (userId, { currentPassword, newPassword }) => {
  try {
    const foundUser = await userModel.findOne({ _id: userId }).lean()
    if (!foundUser) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')

    const isValidPassword = await verifyHashed(currentPassword, foundUser.password)
    if (!isValidPassword) throw new ApiError(StatusCodes.BAD_REQUEST, 'Incorrect current password')

    const isSameCurrentPassword = await verifyHashed(newPassword, foundUser.password)
    if (isSameCurrentPassword)
      throw new ApiError(
        StatusCodes.CONFLICT,
        'New password must not be the same as current password'
      )

    const { isValid, message } = await checkNewPasswordPolicy(
      newPassword,
      foundUser.passwordHistory,
      foundUser.password
    )
    if (!isValid) throw new ApiError(StatusCodes.CONFLICT, message)

    const { hashed } = await hash(newPassword)
    const { modifiedCount } = await userModel.updateOne(
      { _id: userId },
      {
        password: hashed,
        '$addToSet': {
          'passwordHistory': {
            password: foundUser.password
          }
        }
      }
    )
    if (modifiedCount === 0) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Change password failed')
    }
  } catch (error) {
    if (error.name === ApiError.name) throw error
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong')
  }
}

const deleteUser = async (userId) => {
  try {
    const user = await userModel.findByIdAndDelete(userId)
    if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    await cloudinaryProvider.deleteSingle(user.image.id)
    return getUser(user._id)
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Delete user failed')
  }
}

const setBlocked = async (userId, blocked) => {
  try {
    const user = await userModel.findByIdAndUpdate(
      userId,
      { isBlocked: blocked },
      { new: true }
    )
    if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    return getUser(user._id)
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Set blocked failed')
  }
}

const setDefaultAddress = async (userId, addressId) => {
  try {
    const foundAddress = addressModel.findById(addressId)
    if (!foundAddress)
      throw new ApiError(StatusCodes.NOT_FOUND, 'Address not found')

    const user = await userModel.findByIdAndUpdate(
      userId,
      { defaultAddress: addressId },
      { new: true }
    )
    if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    return getUser(user._id)
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Set blocked failed')
  }
}

export default {
  getUser,
  getUsers,
  updateUser,
  uploadAvatar,
  changePassword,
  deleteUser,
  setBlocked,
  setDefaultAddress
}
