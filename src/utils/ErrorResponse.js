import { StatusCodes, ReasonPhrases } from 'http-status-codes'

class ErrorResponse {
  constructor({
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR,
    message = ReasonPhrases.INTERNAL_SERVER_ERROR,
    metadata,
    stack
  }) {
    this.statusCode = statusCode
    this.message = message
    this.metadata = metadata
    this.stack = stack
  }

  send(res) {
    res.status(this.statusCode).json({
      statusCode: this.statusCode,
      message: this.message,
      metadata: this.metadata,
      stack: this.stack
    })
  }
}

export default ErrorResponse
