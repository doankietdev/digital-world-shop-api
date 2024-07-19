import { StatusCodes, ReasonPhrases } from 'http-status-codes'

class ApiError extends Error {
  constructor(
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR,
    message = ReasonPhrases.INTERNAL_SERVER_ERROR,
    metadata = {}
  ) {
    super(message)
    this.statusCode = statusCode
    this.name = 'ApiError'
    this.metadata = metadata

    Error.captureStackTrace(this, this.constructor)
  }
}

export default ApiError
