'use strict'

import { model, Schema } from 'mongoose'
import { COLLECTION_NAMES, MODEL_NAMES, PAYMENT_METHODS, TRANSACTION_STATUS } from '~/utils/constants'

const transactionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: MODEL_NAMES.USER,
    required: true
  },
  orderId: {
    type: Schema.Types.ObjectId,
    ref: MODEL_NAMES.ORDER,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: [PAYMENT_METHODS.CASH, PAYMENT_METHODS.MOMO, PAYMENT_METHODS.PAYPAL],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: [
      TRANSACTION_STATUS.PENDING,
      TRANSACTION_STATUS.COMPLETED,
      TRANSACTION_STATUS.FAILED,
      TRANSACTION_STATUS.REFUNDED
    ],
    default: TRANSACTION_STATUS.PENDING
  },
  referenceId: {
    type: String,
    default: null
  }
}, {
  timestamps: true,
  collection: COLLECTION_NAMES.TRANSACTION
})

export default model(MODEL_NAMES.TRANSACTION, transactionSchema)
