import SuccessResponse from '~/utils/SuccessResponse'
import asyncHandler from '~/utils/asyncHandler'
import userService from '~/services/userService'

const getUser = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Get current user successfully',
    metadata: {
      user: await userService.getUser(req.params?.id, req.query)
    }
  }).send(res)
})

const getCurrentUser = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Get current user successfully',
    metadata: {
      user: await userService.getCurrentUser(req.user?._id, req.query)
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
  const userId = req.user?._id
  new SuccessResponse({
    message: 'Update current user successfully',
    metadata: {
      user: await userService.updateCurrentUser(userId, req.file, req.body)
    }
  }).send(res)
})

const updateUser = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Update user successfully',
    metadata: {
      user: await userService.updateUser(req.params.id, req.file, req.body)
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
  getUser,
  getCurrentUser,
  getUsers,
  updateCurrentUser,
  updateUser,
  deleteUser,
  setBlocked
}
