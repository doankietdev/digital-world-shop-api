import userModel from '~/models/userModel'

const createNew = async (user = {}) => {
  try {
    return (await userModel.create(user))?.toObject()
  } catch (error) {
    throw new Error(error)
  }
}

const findOneByEmail = async (email = '') => {
  return (await userModel.findOne({ email }))?.toObject()
}

const findOneById = async (id) => {
  return (await userModel.findById(id))?.toObject()
}

const pushUsedRefreshToken = async (userId, usedRefreshToken) => {
  return (await userModel.findOneAndUpdate(
    { _id: userId },
    { $push: { usedRefreshTokens: usedRefreshToken } }
  ))?.toObject()
}

export default {
  createNew,
  findOneByEmail,
  findOneById,
  pushUsedRefreshToken
}
