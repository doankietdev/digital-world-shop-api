import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import ErrorResponse from '~/utils/ErrorResponse'
import { BUILD_MODE } from '~/configs/environment'
import { DEV_ENV } from '~/utils/constants'
import ApiError from '~/utils/ApiError'

// eslint-disable-next-line no-unused-vars
const errorHandlingMiddleware = (error, req, res, next) => {
  const isDevMode = BUILD_MODE === DEV_ENV
  if (error.name !== ApiError.name && !isDevMode) {
    error.status = StatusCodes.INTERNAL_SERVER_ERROR
    error.message = ReasonPhrases.INTERNAL_SERVER_ERROR
  }

  const errorResponse = new ErrorResponse({
    statusCode: error.statusCode,
    message: error.message,
    metadata: error.metadata,
    stack: error.stack
  })

  if (!isDevMode) delete errorResponse.stack

  // write error Log to file,
  // shoot error message to Slack group, Telegram, Email...
  errorResponse.send(res)
}

export default errorHandlingMiddleware
