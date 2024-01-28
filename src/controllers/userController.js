import SuccessResponse from '~/utils/SuccessResponse'
import asyncHandler from '~/utils/asyncHandler'
import userService from '~/services/userService'

const getCurrent = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Get current user successfully',
    metadata: {
      user: await userService.getCurrent(req.user?._id)
    }
  }).send(res)
})

const getAll = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Get users successfully',
    metadata: {
      users: await userService.getAll()
    }
  }).send(res)
})

const updateCurrent = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Update current user successfully',
    metadata: {
      user: await userService.updateCurrent(req.user?._id, req.body)
    }
  }).send(res)
})

const updateUser = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Update user successfully',
    metadata: {
      user: await userService.updateUser(req.params.id, req.body)
    }
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

export default {
  getCurrent,
  getAll,
  updateCurrent,
  updateUser,
  deleteUser
}
