import { StatusCodes } from 'http-status-codes'
import addressModel from '~/models/addressModel'
import userModel from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import { parseQueryParams } from '~/utils/formatter'

const createNew = async (userId, reqBody) => {
  try {
    const address = await addressModel.create({ ...reqBody, userId })
    await userModel.findByIdAndUpdate(
      userId,
      { $push: { addresses: address._id } }
    )
    return address
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Create address failed')
  }
}

const getAddress = async (id, reqQuery) => {
  try {
    const { fields } = parseQueryParams(reqQuery)
    const address = await addressModel
      .findById(id)
      .populate('userId', '_id firstName lastName mobile image')
      .select(fields)
    if (!address) throw new ApiError(StatusCodes.NOT_FOUND, 'Address not found')
    return address
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Get address failed')
  }
}

const updateAddressForCurrentUser = async (addressId, userId, reqBody) => {
  try {
    const address = await addressModel.findOneAndUpdate(
      { _id: addressId, userId },
      { ...reqBody },
      { new: true }
    )
    if (!address) throw new ApiError(StatusCodes.NOT_FOUND, 'Address not found')
    return address
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Update address failed')
  }
}

const deleteAddressForCurrentUser = async (addressId, userId) => {
  try {
    const address = await addressModel.findOneAndDelete({ _id: addressId, userId })
    if (!address) throw new ApiError(StatusCodes.NOT_FOUND, 'Address not found')
    await userModel.findByIdAndUpdate(
      userId,
      { $pull: { addresses: addressId } }
    )
    return address
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Update address failed')
  }
}

export default {
  createNew,
  getAddress,
  updateAddressForCurrentUser,
  deleteAddressForCurrentUser
}