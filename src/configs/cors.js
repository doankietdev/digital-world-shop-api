import { StatusCodes } from 'http-status-codes'
import { BUILD_MODE } from './environment'
import { DEV_ENV, TEST_ENV, WHITE_LIST_DOMAINS } from '~/utils/constants'
import ApiError from '~/utils/ApiError'

export const corsOptions = {
  origin: async function (origin, callback) {
    if (!origin && [DEV_ENV, TEST_ENV].includes(BUILD_MODE)) {
      return callback(null, true)
    }
    const isValidDomain = WHITE_LIST_DOMAINS.includes(origin)
    if (isValidDomain) {
      return callback(null, true)
    }
    return callback(new ApiError(StatusCodes.FORBIDDEN, 'Origin not allowed by our CORS Policy'))
  },
  optionsSuccessStatus: 200,
  credentials: true
}
