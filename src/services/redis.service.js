/* eslint-disable no-console */
import { statusConnectRedis } from '~/configs/redis.config'
import { RedisDB } from '../databases/init.redis'
import objectHash from 'object-hash'

const zlib = require('node:zlib')

const redisClient = RedisDB.getInstance().getRedis()

// const pExpire = promisify(redisClient.pexpire).bind(redisClient);
// const setNXAsync = promisify(redisClient.setnx).bind(redisClient);
// const delAsyncKey = promisify(redisClient.del).bind(redisClient);

// static async acquiredLock(productId, quantity, cartId) {
//     const key = `lock_v_2024_${productId}`
//     const retryTimes = 10
//     // 3 seconds for a lock
//     const expireTime = 3000
//     for (let index = 0; index < retryTimes; index++) {
//         // Who can get the lock
//         const result = await setNXAsync(key, expireTime)
//         if (result === 1) {
//             // Update inventory stock
//             const reservation = await InventoryRepository.reservationInventory({
//                 productId,
//                 quantity,
//                 cartId
//             })
//             if (reservation.modifiedCount) {
//                 await pExpire(key, expireTime)
//                 return key
//             }
//             return null
//         } else {
//             await new Promise((resolve) => setTimeout(resolve, 50))
//         }
//     }
// }

// static async releaseLock(keyLock) {
//     return await delAsyncKey(keyLock)
// }

const requestToKey = (req) => {
  // build a custom object to use as part of the Redis key
  const reqDataToHash = {
    query: req.query, body: req.body
  }
  // `${req.path}@...` to make it easier to find
  // keys on a Redis client
  return `${req.baseUrl}${req.path}@${objectHash.sha1(reqDataToHash)}`
}

const isRedisWorking = () => {
  return redisClient.status === statusConnectRedis.READY
}

const writeData = async (key, data, options, compress) => {
  if (isRedisWorking()) {
    let dataToCache = data
    if (compress) {
      // compress the value with ZLIB to save RAM
      dataToCache = zlib.deflateSync(data).toString('base64')
    }

    try {
      const { EX, NX } = options
      if (EX && NX) {
        await redisClient.set(key, dataToCache, 'EX', EX, 'NX')
      } else {
        await redisClient.set(key, dataToCache, 'EX', EX)
      }
      await redisClient.set(key, dataToCache)
    } catch (e) {
      console.error(`Failed to cache data for key=${key}`, e)
    }
  }
}

const readData = async (key, compressed) => {
  let cachedValue = undefined
  if (isRedisWorking()) {
    cachedValue = await redisClient.get(key)
    if (cachedValue) {
      if (compressed) {
        // decompress the cached value with ZLIB
        return zlib
          .inflateSync(Buffer.from(cachedValue, 'base64'))
          .toString()
      } else {
        return cachedValue
      }
    }
  }

  return cachedValue
}

const deleteData = async (key) => {
  try {
    await redisClient.del(key)
  } catch (e) {
    console.error(`Failed to delete cache for key=${key}`, e)
  }
}

const getKeysWithPattern = async (pattern) => {
  return redisClient.keys(pattern)
}

const cache = async ({ key, options = { EX: 21600, NX: false } }, callback, ...args) => {
  const _isRedisWorking = isRedisWorking()

  if (_isRedisWorking) {
    const cachedValue = await readData(key)
    if (cachedValue) {
      return JSON.parse(cachedValue)
    }
  }

  const result = await callback(...args)
  if (_isRedisWorking) {
    await writeData(key, JSON.stringify(result), options)
  }
  return result
}

export {
  requestToKey, isRedisWorking, writeData, readData, deleteData, getKeysWithPattern, cache
}
