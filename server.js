/* eslint-disable no-console */
import exitHook from "async-exit-hook"
import app from "~/app"
import { connectDB, closeDB } from "~/configs/mongodb"
import { APP } from "~/configs/environment"
import { RedisDB } from "~/databases/init.redis"

const startServer = async () => {
  const server = app.listen(APP.PORT, APP.HOST, () => {
    console.log(`Server is running at ${APP.HOST}:${APP.PORT}`)
  })

  const redisClient = RedisDB.getInstance().getRedis()

  exitHook((callback) => {
    Promise.all([
      closeDB()
        .then(() => {
          console.log("Disconnected from MongoDB successfully")
        })
        .catch(() => {
          console.log("Disconnect from MongoDB failed")
        }),
      redisClient
        .flushall()
        .then(() => {
          console.log("Flushed all Redis cache successfully")
        })
        .catch((err) => {
          console.log("Failed to flush Redis cache", err)
        }),
    ]).finally(() => {
      server.close(() => {
        console.log("Closed server")
        callback()
      })
    })
  })
}

;(async () => {
  try {
    await connectDB()
    console.log("Connect to MongoDB successfully")
    startServer()
  } catch (error) {
    console.log("Connect to MongoDB failed")
    process.exit(0)
  }
})()
