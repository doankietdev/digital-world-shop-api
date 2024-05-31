import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import notFoundHandlingMiddleware from './middlewares/notFoundHandlingMiddleware'
import errorHandlingMiddleware from './middlewares/errorHandlingMiddleware'
import { DEV_ENV } from './utils/constants'
import { BUILD_MODE } from './configs/environment'
import { corsOptions } from './configs/cors'
import { route } from './routes'
import fetchLocationToDBJob from './cronJobs/dataCollection/fetchLocationToDBJob'

const app = express()

app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.use(helmet())
app.use(compression())
BUILD_MODE === DEV_ENV && app.use(morgan('dev'))

route(app)

app.use(notFoundHandlingMiddleware)
app.use(errorHandlingMiddleware)

fetchLocationToDBJob.start()

export default app
