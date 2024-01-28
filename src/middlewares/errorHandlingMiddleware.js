import { StatusCodes } from 'http-status-codes'
import ErrorResponse from '~/utils/ErrorResponse'
import { BUILD_MODE } from '~/configs/environment'
import { DEV_ENV } from '~/utils/constants'

// eslint-disable-next-line no-unused-vars
const errorHandlingMiddleware = (error, req, res, next) => {
  if (!error.statusCode) error.statusCode = StatusCodes.INTERNAL_SERVER_ERROR

  const errorResponse = new ErrorResponse({
    statusCode: error.statusCode,
    message: error.message,
    stack: error.stack
  })

  if (BUILD_MODE !== DEV_ENV) delete errorResponse.stack

  // write error Log to file,
  // shoot error message to Slack group, Telegram, Email...
  errorResponse.send(res)
}

export default errorHandlingMiddleware
