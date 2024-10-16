import {
  deleteData,
  getKeysWithPattern,
  isRedisWorking,
  readData,
  requestToKey,
  writeData
} from '~/services/redis.service'

export const redisCachingMiddleware = (
  options = {
    EX: 30 * 60, // 6h
    NX: false
  },
  compression = false, // enable compression and decompression by default
  invalidKey = ''
) => {
  return async (req, res, next) => {
    if (isRedisWorking()) {
      const key = `${requestToKey(req)}_${invalidKey}`
      if (req.method === 'GET') {
        // note the compression option
        const cachedValue = await readData(key, compression)
        if (cachedValue) {
          try {
            return res.json(JSON.parse(cachedValue))
          } catch {
            return res.send(cachedValue)
          }
        } else {
          const oldSend = res.send
          res.send = function (data) {
            res.send = oldSend

            if (res.statusCode.toString().startsWith('2')) {
              // note the compression option
              writeData(key, data, options, compression).then()
            }

            return res.send(data)
          }

          next()
        }
      } else {
        const pattern = `*_${invalidKey}`
        const keys = await getKeysWithPattern(pattern)
        for (const key of keys) {
          await deleteData(key)
        }
        next()
      }
    } else {
      next()
    }
  }
}
