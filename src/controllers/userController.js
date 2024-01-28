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
  const userId = req.user?._id
  new SuccessResponse({
    message: 'Update current user successfully',
    metadata: {
      user: await userService.updateCurrent(userId, req.body)
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

const setBlocked = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Set blocked user successfully',
    metadata: {
      user: await userService.setBlocked(req.params.id, req.body.blocked)
    }
  }).send(res)
})

export default {
  getCurrent,
  getAll,
  updateCurrent,
  updateUser,
  deleteUser,
  setBlocked
}
