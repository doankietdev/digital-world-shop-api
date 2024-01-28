import userModel from '~/models/userModel'

const createNew = async (user = {}) => {
  try {
    return (await userModel.create(user))?.toObject()
  } catch (error) {
    throw new Error(error)
  }
}

const findAll = async () => {
  const users = await userModel.find()
  return users.map(user => user.toObject())
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

const updateById = async (id, update = {}) => {
  return (await userModel.findOneAndUpdate(
    { _id: id },
    { ...update },
    { new: true }
  ))?.toObject()
}

const deleteById = async (id) => {
  return (await userModel.findByIdAndDelete(id)).toObject()
}

export default {
  createNew,
  findAll,
  findOneByEmail,
  findOneById,
  pushUsedRefreshToken,
  updateById,
  deleteById
}
