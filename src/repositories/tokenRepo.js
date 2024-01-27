import tokenModel from '~/models/tokenModel'

/**
 * @param {object} token
 * @param {string} token.userId
 * @param {string} token.accessToken
 * @param {string} token.refreshToken
 * @returns {Promise<object>}
 */
const createNew = async (token = {}) => {
  return (await tokenModel.create(token))?.toObject()
}

/**
 * @param {object} query
 * @param {string} query.userId
 * @param {string} query.accessToken
 * @param {string} query.refreshToken
 * @returns {Promise<object>}
 */
const findOne = async (query = {}) => {
  return (await tokenModel.findOne(query))?.toObject()
}

/**
 * @param {object} query
 * @param {string} query._id
 * @param {string} query.userId
 * @param {string} query.accessToken
 * @param {string} query.refreshToken
 * @returns {Promise<object>}
 */
const deleteOne = async (query = {}) => {
  return (await tokenModel.deleteOne(query))
}

/**
 * @param {string} userId
 * @returns {Promise<object>}
 */
const deleteByUserId = async (userId) => {
  return (await tokenModel.deleteMany({ userId }))?.toObject()
}

export default {
  createNew,
  findOne,
  deleteOne,
  deleteByUserId
}
