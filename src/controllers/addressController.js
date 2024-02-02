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

const getAddress = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Get address successfully',
    metadata: {
      address: await addressService.getAddress(req.params.id, req.query)
    }
  }).send(res)
})

const updateAddressForCurrentUser = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Update address successfully',
    metadata: {
      address: await addressService.updateAddressForCurrentUser(
        req.params?.addressId,
        req.user?._id,
        req.body
      )
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
  getAddress,
  updateAddressForCurrentUser,
  deleteAddressForCurrentUser
}