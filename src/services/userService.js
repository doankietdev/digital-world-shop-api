import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import addressModel from '~/models/addressModel'
import userModel from '~/models/userModel'
import cloudinaryProvider from '~/providers/cloudinaryProvider'
import ApiError from '~/utils/ApiError'
import { parseQueryParams } from '~/utils/formatter'
import { calculateTotalPages } from '~/utils/util'
import locationService from './locationService'

const getUser = async (userId) => {
  try {
    const foundUser = await userModel
      .findOne({
        _id: userId
      })
      .populate({
        path: 'defaultAddress',
        select: '-user'
      })
      .select('-password -publicKey -privateKey -usedRefreshTokens')
      .lean()
    if (!foundUser)
      throw new ApiError(StatusCodes.NOT_FOUND, 'Something went wrong')

    if (foundUser.defaultAddress) {
      const { provinceId, districtId, wardCode } = foundUser.defaultAddress
      const [province, district, ward] = await Promise.all([
        locationService.getProvince(provinceId),
        locationService.getDistrict({ provinceId, districtId }),
        locationService.getWard({ districtId, wardCode })
      ])
      if (!province || !district || !ward)
        throw new ApiError(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND)

      foundUser.defaultAddress = {
        ...foundUser.defaultAddress,
        province,
        district,
        ward
      }
      delete foundUser.defaultAddress.provinceId
      delete foundUser.defaultAddress.districtId
      delete foundUser.defaultAddress.wardCode
    }

    return foundUser
  } catch (error) {
    if (error.name === ApiError.name) throw error
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Get current user failed'
    )
  }
}

const getUsers = async (reqQuery) => {
  try {
    const { query, sort, fields, limit, skip, page } =
      parseQueryParams(reqQuery)

    const BASE_SELECT = '-password -publicKey -privateKey -usedRefreshTokens'

    const [users, totalUsers] = await Promise.all([
      userModel
        .find(query)
        .populate({
          path: 'defaultAddress',
          select: '-user'
        })
        .select(fields ? `${fields} ${BASE_SELECT}` : BASE_SELECT)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      userModel.countDocuments()
    ])

    let responseUsers = []
    for (const user of users) {
      if (user.defaultAddress) {
        const { provinceId, districtId, wardCode } = user.defaultAddress
        const [province, district, ward] = await Promise.all([
          locationService.getProvince(provinceId),
          locationService.getDistrict({ provinceId, districtId }),
          locationService.getWard({ districtId, wardCode })
        ])
        if (!province || !district || !ward)
          throw new ApiError(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND)

        user.defaultAddress = {
          ...user.defaultAddress,
          province,
          district,
          ward
        }
        delete user.defaultAddress.provinceId
        delete user.defaultAddress.districtId
        delete user.defaultAddress.wardCode
      }
      responseUsers = [...responseUsers, user]
    }

    return {
      page,
      totalPages: calculateTotalPages(totalUsers, limit),
      totalUsers,
      users: responseUsers
    }
  } catch (error) {
    if (error.name === ApiError.name) throw error
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
    return getUser(user._id)
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Update current user failed'
    )
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
    return getUser(user._id)
  } catch (error) {
    if (error.name === ApiError.name) throw error
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Update user failed')
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
  updateCurrentUser,
  updateUser,
  deleteUser,
  setBlocked,
  setDefaultAddress
}
