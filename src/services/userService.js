import { StatusCodes } from 'http-status-codes'
import userRepo from '~/repositories/userRepo'
import ApiError from '~/utils/ApiError'

const removeNoResponseFields = (user = {}) => {
  const noResponseFields = [
    'password',
    'role',
    'publicKey',
    'privateKey',
    'passwordResetToken',
    'passwordResetExpires',
    'usedRefreshTokens'
  ]
  const nextUser = { ...user }
  noResponseFields.forEach(field => {
    delete nextUser[field]
  })
  return nextUser
}

const removeNoUpdateCurrentUserFields = (updateData = {}) => {
  const noUpdateFields = [
    'role',
    'cart',
    'wishlist',
    'isBlocked',
    'passwordChangedAt',
    'passwordResetToken',
    'publicKey',
    'privateKey',
    'usedRefreshTokens'
  ]
  const nextUpdateData = { ...updateData }
  noUpdateFields.forEach(field => {
    delete nextUpdateData[field]
  })
  return nextUpdateData
}

const removeNoUpdateUserFields = (updateData = {}) => {
  const noUpdateFields = [
    'isBlocked',
    'cart',
    'wishlist',
    'passwordChangedAt',
    'passwordResetToken',
    'publicKey',
    'privateKey',
    'usedRefreshTokens'
  ]
  const nextUpdateData = { ...updateData }
  noUpdateFields.forEach(field => {
    delete nextUpdateData[field]
  })
  return nextUpdateData
}

const getCurrent = async (userId) => {
  const user = await userRepo.findOneById(userId)
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'Something went wrong')
  return removeNoResponseFields(user)
}

const getAll = async () => {
  const users = await userRepo.findAll()
  return users.map(user => {
    return removeNoResponseFields(user)
  })
}

const updateCurrent = async (userId, {
  firstName,
  lastName,
  mobile,
  password,
  address
}) => {
  const user = await userRepo.updateById(userId, {
    firstName,
    lastName,
    mobile,
    password,
    address
  })
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'Something went wrong')
  return removeNoResponseFields(user)
}

const updateUser = async (userId, {
  firstName,
  lastName,
  mobile,
  password,
  address,
  role
}) => {
  const user = await userRepo.updateById(userId, {
    firstName,
    lastName,
    mobile,
    password,
    address,
    role
  })
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
  return removeNoResponseFields(user)
}

const deleteUser = async(userId) => {
  const user = await userRepo.deleteById(userId)
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
  return removeNoResponseFields(user)
}

const setBlocked = async(userId, blocked) => {
  const user = await userRepo.updateById(userId, { isBlocked: blocked })
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
  return removeNoResponseFields(user)
}

export default {
  getCurrent,
  getAll,
  updateCurrent,
  updateUser,
  deleteUser,
  setBlocked
}