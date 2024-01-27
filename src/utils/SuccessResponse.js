import { StatusCodes, ReasonPhrases } from 'http-status-codes'

class SuccessResponse {
  constructor({
    statusCode = StatusCodes.OK,
    message = ReasonPhrases.OK,
    metadata = {}
  }) {
    this.statusCode = statusCode
    this.message = message
    this.metadata = metadata
  }

  send(res) {
    res.status(this.statusCode).json({
      statusCode: this.statusCode,
      message: this.message,
      metadata: this.metadata
    })
  }
}

export default SuccessResponse
