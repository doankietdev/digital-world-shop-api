import { handleEventConnection } from '~/configs/redis.config'
import { REDIS } from '~/configs/environment'
import Redis from 'ioredis'

export class RedisDB {
  client = {}

  static instance

  static getInstance() {
    if (!RedisDB.instance) {
      RedisDB.instance = new RedisDB()
    }
    return RedisDB.instance
  }

  constructor() {
    this.initRedis()
  }

  initRedis() {
    const instanceRedis = new Redis({
      host: REDIS.HOST,
      port: REDIS.PORT,
      username: REDIS.USER,
      password: REDIS.PASSWORD
    })
    this.client.instanceConnect = instanceRedis
    handleEventConnection({
      connectionRedis: instanceRedis
    })
  }

  getRedis() {
    return this.client.instanceConnect
  }

  closeRedis() {
    return this.getRedis().quit()
  }
}
