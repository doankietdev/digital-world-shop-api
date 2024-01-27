/* eslint-disable no-console */
import exitHook from 'async-exit-hook'
import app from '~/app'
import { connectDB, closeDB } from '~/configs/mongodb'
import { APP } from '~/configs/environment'

const startServer = async () => {
  const server = app.listen(APP.PORT, APP.HOST, () => {
    console.log(`Server is running at ${APP.HOST}:${APP.PORT}`)
  })

  exitHook(() => {
    closeDB()
      .then(() => {
        console.log('Disconnected from MongoDB successfully')
        server.close()
        console.log('Closed server')
      })
      .catch(() => {
        console.log('Disconnect from MongoDB failed')
      })
  })
}

(async () => {
  try {
    await connectDB()
    console.log('Connect to MongoDB successfully')
    startServer()
  } catch (error) {
    console.log('Connect to MongoDB failed')
    process.exit(0)
  }
})()