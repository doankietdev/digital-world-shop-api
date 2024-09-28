import 'dotenv/config'
import ms from 'ms'
import { DEV_ENV } from '~/utils/constants'

const {
  NODE_ENV,
  MONGODB_URI,
  DATABASE_NAME,
  APP_PROTOCOL,
  APP_HOST,
  APP_PORT,
  BRAND_NAME,
  CLIENT_URL,
  CLIENT_OTP_FORM_PATH,
  EMAIL_VERIFICATION_TOKEN_LIFE,
  ACCESS_TOKEN_LIFE,
  REFRESH_TOKEN_LIFE,
  SESSION_LIFE,
  MAX_SESSIONS,
  PASSWORD_RESET_OTP_LIFE,
  PASSWORD_RESET_TOKEN_LIFE,
  NEW_PASSWORD_NOT_SAME_OLD_PASSWORD_TIME,
  EMAIL_APP_PASSWORD,
  EMAIL_NAME,
  GOOGLE_CLIENT_ID,
  GOOGLE_SECRET,
  CLOUDINARY_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  PASSWORD_RESET_OTP_BASE32_SECRET_KEY,
  GHN_TOKEN,
  PAYPAL_CLIENT_ID,
  PAYPAL_CLIENT_SECRET,
  REDIS_HOST,
  REDIS_PORT,
  REDIS_USER,
  REDIS_PASSWORD
} = process.env

export const BUILD_MODE = NODE_ENV || DEV_ENV

export const APP = {
  PROTOCOL: APP_PROTOCOL || 'http',
  HOST: APP_HOST || 'localhost',
  PORT: APP_PORT || 5600,
  BRAND_NAME: BRAND_NAME || 'No Name Yet'
}

export const CLIENT = {
  URL: CLIENT_URL || 'http://localhost:3000', CLIENT_OTP_FORM_PATH: CLIENT_OTP_FORM_PATH || '/auth/password-reset-otp'
}

export const MONGODB = {
  URI: MONGODB_URI || 'mongodb://localhost:27017/', DATABASE_NAME: DATABASE_NAME || ''
}

export const AUTH = {
  EMAIL_VERIFICATION_TOKEN_LIFE: ms(EMAIL_VERIFICATION_TOKEN_LIFE || '15m'),
  ACCESS_TOKEN_LIFE: ACCESS_TOKEN_LIFE || '1h',
  REFRESH_TOKEN_LIFE: REFRESH_TOKEN_LIFE || '30 days',
  PASSWORD_RESET_OTP_LIFE: ms(PASSWORD_RESET_OTP_LIFE || '2m'),
  PASSWORD_RESET_TOKEN_LIFE: ms(PASSWORD_RESET_TOKEN_LIFE || '2m'),
  NEW_PASSWORD_NOT_SAME_OLD_PASSWORD_TIME: ms(NEW_PASSWORD_NOT_SAME_OLD_PASSWORD_TIME || '90 days'),
  PASSWORD_RESET_OTP_SECRET_KEY: PASSWORD_RESET_OTP_BASE32_SECRET_KEY || '',
  SESSION_LIFE: ms(SESSION_LIFE || '30 days'),
  MAX_SESSIONS: +MAX_SESSIONS || 5,
  GOOGLE_CLIENT_ID,
  GOOGLE_SECRET
}

export const EMAIL = {
  APP_PASSWORD: EMAIL_APP_PASSWORD, NAME: EMAIL_NAME
}

export const CLOUDINARY = {
  NAME: CLOUDINARY_NAME, API_KEY: CLOUDINARY_API_KEY, API_SECRET: CLOUDINARY_API_SECRET
}

export const PARTNERS = {
  GHN: {
    TOKEN: GHN_TOKEN
  }, PAYPAL: {
    CLIENT_ID: PAYPAL_CLIENT_ID, SECRET_KEY: PAYPAL_CLIENT_SECRET
  }
}

export const REDIS = {
  HOST: REDIS_HOST,
  PORT: REDIS_PORT,
  PASSWORD: REDIS_PASSWORD || null,
  USER: REDIS_USER || null
}