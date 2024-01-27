import 'dotenv/config'
import { DEV_ENV } from '~/utils/constants'

const {
  NODE_ENV,
  MONGODB_URI,
  DATABASE_NAME,
  APP_HOST,
  APP_PORT,
  ACCESS_TOKEN_EXPIRES,
  REFRESH_TOKEN_EXPIRES
} = process.env

export const BUID_MODE = NODE_ENV || DEV_ENV

export const APP = {
  HOST: APP_HOST || 'localhost',
  PORT: APP_PORT || 5600
}

export const MONGODB = {
  URI: MONGODB_URI || 'mongodb://localhost:27017/',
  DATABASE_NAME: DATABASE_NAME || ''
}

export const AUTH = {
  ACCESS_TOKEN_EXPIRES: ACCESS_TOKEN_EXPIRES || 1000 * 60 * 60,
  REFRESH_TOKEN_EXPIRES: REFRESH_TOKEN_EXPIRES || 1000 * 60 * 60 * 24 * 90
}
