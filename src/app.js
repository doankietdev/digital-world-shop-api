import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import { corsOptions } from './configs/cors'
import { BUILD_MODE } from './configs/environment'
import agentParsingMiddleware from './middlewares/agentParsingMiddleware'
import errorHandlingMiddleware from './middlewares/errorHandlingMiddleware'
import notFoundHandlingMiddleware from './middlewares/notFoundHandlingMiddleware'
import { route } from './routes'
import { DEV_ENV } from './utils/constants'

const app = express()

app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.use(helmet())
app.use(compression())
BUILD_MODE === DEV_ENV && app.use(morgan('dev'))
app.use(agentParsingMiddleware)

route(app)

app.use(notFoundHandlingMiddleware)
app.use(errorHandlingMiddleware)

export default app
