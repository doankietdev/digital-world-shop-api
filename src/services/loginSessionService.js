'use strict'

import loginSessionModel from '~/models/loginSessionModel'
import { cleanObject } from '~/utils/formatter'

/**
 * Create new login session
 * @param {{
 *  userId: String,
 *  publicKey: String,
 *  ip: String,
 *  browser: {
 *    name: String,
 *    version: String
 *  },
 *  os: {
 *    name: String,
 *    version: String
 *  }
 *  device: {
 *    deviceType: String,
 *    model: String,
 *    vendor: String,
 *  }}} payload
 */
const createNew = async (payload = {}) => {
  const { userId, ip, browser, os } = payload

  const filter = cleanObject({
    userId,
    ip,
    'browser.name': browser?.name,
    'os.name': os?.name
  })

  const update = cleanObject({
    ...payload
  })

  return await loginSessionModel
    .findOneAndUpdate(filter, update, { upsert: true, new: true })
    .lean()
}

/**
 * Get login session
 * @param {{ userId: string, ip: string, browserName: string, osName: string }} query
 */
const getOne = async (query = {}) => {
  const { userId, ip, browserName, osName } = query
  const filter = cleanObject({
    userId,
    ip,
    'browser.name': browserName,
    'os.name': osName
  })

  return await loginSessionModel.findOne(filter).lean()
}

/**
 * Get login sessions by user id
 * @param {{ userId: string, ip: string, browserName: string, osName: string }} query
 */
const getMany = async (query) => {
  const { userId, ip, browserName, osName } = query
  const filter = cleanObject({
    userId,
    ip,
    'browser.name': browserName,
    'os.name': osName
  })

  return await loginSessionModel.find(filter).lean()
}

/**
 * Delete login session by id
 * @param {string} id
 */
const deleteById = async (id = '') => {
  const { deletedCount } = await loginSessionModel.deleteOne({ _id: id }).lean()
  if (deletedCount === 0) return false
  return true
}

/**
 * Delete login sessions by user id
 * @param {string} userId
 */
const deleteManyByUserId = async (userId = '') => {
  const { deletedCount } = await loginSessionModel.deleteOne({ userId }).lean()
  if (deletedCount === 0) return false
  return true
}

export default {
  createNew,
  getOne,
  getMany,
  deleteById,
  deleteManyByUserId
}
