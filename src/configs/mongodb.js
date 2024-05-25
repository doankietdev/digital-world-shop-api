import mongoose from 'mongoose'
import { BUILD_MODE, MONGODB } from './environment'
import { DEV_ENV } from '~/utils/constants'

let dbInstance = null

export const connectDB = async () => {
  if (!dbInstance) {
    if (BUILD_MODE === DEV_ENV) {
      // mongoose.set('debug', true)
      // mongoose.set('debug', { color: true })
    }
    dbInstance = await mongoose.connect(MONGODB.URI, {
      dbName: MONGODB.DATABASE_NAME
    })
  }
  return dbInstance
}

export const closeDB = async () => {
  await mongoose.connection.close()
}
