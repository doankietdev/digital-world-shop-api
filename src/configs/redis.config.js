/* eslint-disable no-console */
import {
  REDIS_CONNECT_MESSAGE,
  REDIS_CONNECT_TIMEOUT
} from '~/utils/constants'
import ApiError from '~/utils/ApiError'

export const statusConnectRedis = {
  READY: 'ready',
  CONNECT: 'connect',
  END: 'end',
  RECONNECT: 'reconnecting',
  ERROR: 'error'
}

let connectionTimeout

const handleTimeoutError = () => {
  connectionTimeout = setTimeout(() => {
    throw new ApiError(
      REDIS_CONNECT_MESSAGE.statusCode,
      REDIS_CONNECT_MESSAGE.message
    )
  }, REDIS_CONNECT_TIMEOUT)
}

export const handleEventConnection = ({ connectionRedis }) => {
  connectionRedis.on(statusConnectRedis.CONNECT, () => {
    console.log('RedisConnection - Connection status: Connected')
    clearTimeout(connectionTimeout)
  })
  connectionRedis.on(statusConnectRedis.END, () => {
    console.log('RedisConnection - Connection status: End')
    handleTimeoutError()
  })
  connectionRedis.on(statusConnectRedis.RECONNECT, () => {
    console.log('RedisConnection - Connection status: Reconnecting')
    clearTimeout(connectionTimeout)
  })
  connectionRedis.on(statusConnectRedis.ERROR, (err) => {
    console.log(`RedisConnection - Connection status: ${err}`)
    handleTimeoutError()
  })
}
