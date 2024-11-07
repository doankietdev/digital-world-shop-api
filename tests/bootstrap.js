import { closeDB, connectDB } from '~/configs/mongodb'
import { RedisDB } from '~/databases/init.redis'
import { getCredentials } from './credentials'

let redisClient

beforeAll(async () => {
  await connectDB()
  redisClient = RedisDB.getInstance().getRedis()

  const { user, clientId, accessToken, refreshToken } = await getCredentials()
  global.user = user
  global.clientId = clientId
  global.accessToken = accessToken,
  global.refreshToken = refreshToken
})

afterAll(async () => {
  closeDB().then().catch(), redisClient.flushall().then().catch()
})
