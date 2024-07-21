import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import addressModel from '~/models/addressModel'
import userModel from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import locationService from './locationService'
import userService from './userService'

const createNew = async (userId, reqBody) => {
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
}

const getUserAddresses = async ({ userId, addressId }) => {
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
}

const getUserAddress = async ({ userId, addressId }) => {
  const [address] = await getUserAddresses({ userId, addressId })
  if (!address) throw new ApiError(StatusCodes.NOT_FOUND, 'Address not found')
  return address
}

const updateAddressForCurrentUser = async ({ userId, addressId, reqBody }) => {
  const { provinceId, districtId, wardCode } = reqBody
  if (provinceId || districtId || wardCode) {
    const isValidLocation = await locationService.checkLocation({
      provinceId,
      districtId,
      wardCode
    })
    if (!isValidLocation) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid location')
    }
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

  return await getUserAddress({ userId, addressId })
}

const deleteAddressForCurrentUser = async (addressId, userId) => {
  const address = await addressModel.findOneAndDelete({
    _id: addressId,
    userId
  })
  if (!address) throw new ApiError(StatusCodes.NOT_FOUND, 'Address not found')
  return address
}

export default {
  createNew,
  getUserAddresses,
  getUserAddress,
  updateAddressForCurrentUser,
  deleteAddressForCurrentUser
}
