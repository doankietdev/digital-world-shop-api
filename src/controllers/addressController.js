import addressService from '~/services/addressService'
import SuccessResponse from '~/utils/SuccessResponse'
import asyncHandler from '~/utils/asyncHandler'

const createNew = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Create new address successfully',
    metadata: {
      address: await addressService.createNew(req.user?._id, req.body)
    }
  }).send(res)
})

const getUserAddresses = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Get user addresses successfully',
    metadata: {
      addresses: await addressService.getUserAddresses({ userId: req.user._id })
    }
  }).send(res)
})

const getUserAddress = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Get user address successfully',
    metadata: {
      address: await addressService.getUserAddress({
        userId: req.user._id,
        addressId: req.params.addressId
      })
    }
  }).send(res)
})

const updateAddressForCurrentUser = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Update address successfully',
    metadata: {
      address: await addressService.updateAddressForCurrentUser({
        userId: req.user?._id,
        addressId: req.params?.addressId,
        reqBody: req.body
      })
    }
  }).send(res)
})

const deleteAddressForCurrentUser = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Delete address successfully',
    metadata: {
      address: await addressService.deleteAddressForCurrentUser(
        req.params?.addressId,
        req.user?._id
      )
    }
  }).send(res)
})

export default {
  createNew,
  getUserAddresses,
  getUserAddress,
  updateAddressForCurrentUser,
  deleteAddressForCurrentUser
}
