import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import ErrorResponse from '~/utils/ErrorResponse'
import { BUILD_MODE } from '~/configs/environment'
import { DEV_ENV } from '~/utils/constants'
import ApiError from '~/utils/ApiError'

// eslint-disable-next-line no-unused-vars
const errorHandlingMiddleware = (error, req, res, next) => {
  const isApiError = error.name === ApiError.name

  const errorResponse = new ErrorResponse({
    statusCode: isApiError ? error.statusCode : StatusCodes.INTERNAL_SERVER_ERROR,
    message: isApiError ? error.message : ReasonPhrases.INTERNAL_SERVER_ERROR,
    metadata: error.metadata,
    stack: error.stack
  })

  if (BUILD_MODE !== DEV_ENV) delete errorResponse.stack

  // write error Log to file,
  // shoot error message to Slack group, Telegram, Email...
  errorResponse.send(res)
}

export default errorHandlingMiddleware
