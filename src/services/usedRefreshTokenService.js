'use strict'

import usedRefreshTokenModel from '~/models/usedRefreshTokenModel'

/**
 * Add used refresh token
 * @param {{ userId: string, code: string }} payload
 */
const add = async (payload = {}) => {
  return await usedRefreshTokenModel.create(payload)
}

/**
 * Get used refresh token
 * @param {{ userId: string, code: string }} query
 */
const getOne = async (query = {}) => {
  return await usedRefreshTokenModel.findOne(query).lean()
}

export default {
  add,
  getOne
}
