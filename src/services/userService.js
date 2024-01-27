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

const getCurrent = async (userId) => {
  const user = await userRepo.findOneById(userId)
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'Something went wrong')
  return removeNoResponseFields(user)
}

export default {
  getCurrent
}