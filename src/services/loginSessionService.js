'use strict'

import { StatusCodes } from 'http-status-codes'
import loginSessionModel from '~/models/loginSessionModel'
import ApiError from '~/utils/ApiError'
import { cleanObject } from '~/utils/formatter'
import { v4 as uuidv4 } from 'uuid'

/**
 * Create new login session
 * @param {{
 *  clientId: String,
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
  const { clientId = uuidv4(), userId, ip, browser, os } = payload

  const filter = cleanObject({
    clientId,
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
 * @param {{
 *  clientId: string,
 *  userId: string,
 *  ip: string,
 *  browserName: string,
 *  osName: string
 * }} query
 */
const getOne = async (query = {}) => {
  const { clientId, userId, ip, browserName, osName } = query
  const filter = cleanObject({
    clientId,
    userId,
    ip,
    'browser.name': browserName,
    'os.name': osName
  })

  return await loginSessionModel.findOne(filter).lean()
}

/**
 * Get login sessions by user id
 * @param {{
 *  clientId: string,
 *  userId: string,
 *  ip: string,
 *  browserName: string,
 *  osName: string
 * }} query
 */
const getMany = async (query) => {
  const { clientId, userId, ip, browserName, osName } = query
  const filter = cleanObject({
    clientId,
    userId,
    ip,
    'browser.name': browserName,
    'os.name': osName
  })

  return await loginSessionModel.find(filter).lean()
}

const getByUserId = async (userId) => {
  return await loginSessionModel.find({ userId }).select('-publicKey').lean()
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
  const { deletedCount } = await loginSessionModel.deleteMany({ userId })
  if (deletedCount === 0) return false
  return true
}

const logoutSessionForCurrentUser = async ({ loginSessionId, userId }) => {
  const { deletedCount } = await loginSessionModel.deleteOne({ _id: loginSessionId, userId })
  if (!deletedCount) throw new ApiError(StatusCodes.NOT_FOUND, 'Login session not found')
}

export default {
  createNew,
  getOne,
  getMany,
  getByUserId,
  deleteById,
  deleteManyByUserId,
  logoutSessionForCurrentUser
}
