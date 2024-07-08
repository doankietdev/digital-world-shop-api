import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import addressModel from '~/models/addressModel'
import userModel from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import locationService from './locationService'
import userService from './userService'

const createNew = async (userId, reqBody) => {
  try {
    const { provinceId, districtId, wardCode } = reqBody

    const isValidLocation = await locationService.checkLocation({
      provinceId,
      districtId,
      wardCode
    })
    if (!isValidLocation) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid parameters')
    }

    const addressData = {
      ...reqBody,
      user: userId
    }
    delete addressData.setAsDefault

    const address = await addressModel.create(addressData)
    if (reqBody.setAsDefault) {
      await userService.setDefaultAddress(userId, address._id)
    }

    return address
  } catch (error) {
    if (error.name === ApiError.name) throw error
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Create address failed'
    )
  }
}

const getUserAddresses = async ({ userId, addressId }) => {
  try {
    const addresses = await addressModel
      .find(
        addressId
          ? {
            user: userId,
            _id: addressId
          }
          : {
            user: userId
          }
      )
      .select('-user')
      .sort('-createdAt')
      .lean()

    const foundUser = await userModel.findOne({ _id: userId })
    if (!foundUser) throw Error('User not found')

    let responseAddresses = []
    for (const address of addresses) {
      const { provinceId, districtId, wardCode } = address
      const [province, district, ward] = await Promise.all([
        locationService.getProvince(provinceId),
        locationService.getDistrict({ provinceId, districtId }),
        locationService.getWard({ districtId, wardCode })
      ])
      if (!province || !district || !ward)
        throw new ApiError(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND)

      let tempAddress = {
        ...address,
        province,
        district,
        ward,
        default:
          address?._id.toString() == foundUser.defaultAddress.toString() ??
          false
      }
      delete tempAddress.provinceId
      delete tempAddress.districtId
      delete tempAddress.wardCode

      responseAddresses = [...responseAddresses, tempAddress]
    }

    return responseAddresses
  } catch (error) {
    if (error.name === ApiError.name) throw error
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Get user addresses failed'
    )
  }
}

const getUserAddress = async ({ userId, addressId }) => {
  try {
    const [address] = await getUserAddresses({ userId, addressId })
    if (!address) throw new ApiError(StatusCodes.NOT_FOUND, 'Address not found')
    return address
  } catch (error) {
    if (error.name === ApiError.name) throw error
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Get user address failed'
    )
  }
}

const updateAddressForCurrentUser = async ({ userId, addressId, reqBody }) => {
  try {
    const { provinceId, districtId, wardCode } = reqBody
    const isValidLocation = await locationService.checkLocation({
      provinceId,
      districtId,
      wardCode
    })
    if (!isValidLocation) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid parameters')
    }

    const addressData = {
      ...reqBody
    }
    delete addressData.setAsDefault
    delete addressData.user

    const { matchedCount } = await addressModel.updateOne(
      { _id: addressId, user: userId },
      addressData
    )
    if (!matchedCount)
      throw new ApiError(StatusCodes.NOT_FOUND, 'Address not found')

    if (reqBody.setAsDefault) {
      await userService.setDefaultAddress(userId, addressId)
    }

    return getUserAddress({ userId, addressId })
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Update address failed'
    )
  }
}

const deleteAddressForCurrentUser = async (addressId, userId) => {
  try {
    const address = await addressModel.findOneAndDelete({
      _id: addressId,
      userId
    })
    if (!address) throw new ApiError(StatusCodes.NOT_FOUND, 'Address not found')
    await userModel.findByIdAndUpdate(userId, {
      $pull: { addresses: addressId }
    })
    return address
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Update address failed'
    )
  }
}

export default {
  createNew,
  getUserAddresses,
  getUserAddress,
  updateAddressForCurrentUser,
  deleteAddressForCurrentUser
}
