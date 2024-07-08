import SuccessResponse from '~/utils/SuccessResponse'
import asyncHandler from '~/utils/asyncHandler'
import userService from '~/services/userService'
import { findFileFromReqFiles } from '~/utils/util'

const getUser = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Get current user successfully',
    metadata: {
      user: await userService.getUser(req.params?.id)
    }
  }).send(res)
})

const getCurrentUser = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Get current user successfully',
    metadata: {
      user: await userService.getUser(req.user?._id)
    }
  }).send(res)
})

const getUsers = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Get users successfully',
    metadata: {
      ...await userService.getUsers(req.query)
    }
  }).send(res)
})

const updateCurrentUser = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Update current user successfully',
    metadata: {
      user: await userService.updateUser(req.user?._id, req.body)
    }
  }).send(res)
})

const uploadAvatarForCurrentUser = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Upload avatar for current user successfully',
    metadata: {
      user: await userService.uploadAvatar(req.user?._id, findFileFromReqFiles(req.files, 'image'))
    }
  }).send(res)
})

const changePassword = asyncHandler(async (req, res) => {
  await userService.changePassword(req.user._id, req.body)
  new SuccessResponse({
    message: 'Change password successfully'
  }).send(res)
})

const deleteUser = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Delete user successfully',
    metadata: {
      user: await userService.deleteUser(req.params.id)
    }
  }).send(res)
})

const setBlocked = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Set blocked user successfully',
    metadata: {
      user: await userService.setBlocked(req.params.id, req.body.blocked)
    }
  }).send(res)
})

const setDefaultAddress = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Set default address successfully',
    metadata: {
      user: await userService.setDefaultAddress(req.user._id, req.body.addressId)
    }
  }).send(res)
})

export default {
  getUser,
  getCurrentUser,
  getUsers,
  updateCurrentUser,
  uploadAvatarForCurrentUser,
  changePassword,
  deleteUser,
  setBlocked,
  setDefaultAddress
}
