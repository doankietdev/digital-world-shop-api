import { StatusCodes } from 'http-status-codes'
import { Types } from 'mongoose'
import addressModel from '~/models/addressModel'
import userModel from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import { COLLECTION_NAMES } from '~/utils/constants'

const createNew = async (userId, reqBody) => {
  try {
    const address = await addressModel.create({ ...reqBody, userId: null })
    await userModel.findByIdAndUpdate(userId, {
      $push: { addresses: address._id }
    })
    return address
  } catch (error) {
    if (error.name === ApiError.name) throw error
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Create address failed'
    )
  }
}

const getUserAddresses = async ({ userId }) => {
  try {
    const addresses = await addressModel.aggregate([
      {
        $match: {
          userId: Types.ObjectId.createFromHexString(userId)
        }
      },
      {
        $lookup: {
          from: COLLECTION_NAMES.PROVINCE,
          foreignField: '_id',
          localField: 'provinceId',
          as: 'province',
          pipeline: [
            {
              $project: {
                createdAt: 0,
                updatedAt: 0
              }
            }
          ]
        }
      },
      {
        $lookup: {
          from: COLLECTION_NAMES.DISTRICT,
          foreignField: '_id',
          localField: 'districtId',
          as: 'district',
          pipeline: [
            {
              $project: {
                createdAt: 0,
                updatedAt: 0
              }
            }
          ]
        }
      },
      {
        $lookup: {
          from: COLLECTION_NAMES.WARD,
          foreignField: '_id',
          localField: 'wardId',
          as: 'ward',
          pipeline: [
            {
              $project: {
                createdAt: 0,
                updatedAt: 0
              }
            }
          ]
        }
      },
      {
        $unwind: '$province'
      },
      {
        $unwind: '$district'
      },
      {
        $unwind: '$ward'
      },
      {
        $project: {
          provinceId: 0,
          districtId: 0,
          wardId: 0
        }
      }
    ])
    return addresses
  } catch (error) {
    if (error.name === ApiError.name) throw error
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Get address failed')
  }
}

const getAddress = async ({ id }) => {
  try {
    const address = (
      await addressModel.aggregate([
        {
          $match: {
            _id: Types.ObjectId.createFromHexString(id)
          }
        },
        {
          $lookup: {
            from: COLLECTION_NAMES.PROVINCE,
            foreignField: '_id',
            localField: 'provinceId',
            as: 'province',
            pipeline: [
              {
                $project: {
                  createdAt: 0,
                  updatedAt: 0
                }
              }
            ]
          }
        },
        {
          $lookup: {
            from: COLLECTION_NAMES.DISTRICT,
            foreignField: '_id',
            localField: 'districtId',
            as: 'district',
            pipeline: [
              {
                $project: {
                  createdAt: 0,
                  updatedAt: 0
                }
              }
            ]
          }
        },
        {
          $lookup: {
            from: COLLECTION_NAMES.WARD,
            foreignField: '_id',
            localField: 'wardId',
            as: 'ward',
            pipeline: [
              {
                $project: {
                  createdAt: 0,
                  updatedAt: 0
                }
              }
            ]
          }
        },
        {
          $unwind: '$province'
        },
        {
          $unwind: '$district'
        },
        {
          $unwind: '$ward'
        },
        {
          $project: {
            provinceId: 0,
            districtId: 0,
            wardId: 0
          }
        }
      ])
    )[0]
    if (!address) throw new ApiError(StatusCodes.NOT_FOUND, 'Address not found')
    return address
  } catch (error) {
    if (error.name === ApiError.name) throw error
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Get address failed')
  }
}

const updateAddressForCurrentUser = async ({ userId, addressId, reqBody }) => {
  try {
    const { acknowledged } = await addressModel.updateOne(
      { _id: addressId, userId },
      { ...reqBody }
    )
    if (!acknowledged)
      throw new ApiError(StatusCodes.NOT_FOUND, 'Address not found')
    return getAddress({ id: addressId })
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
  updateAddressForCurrentUser,
  deleteAddressForCurrentUser
}
