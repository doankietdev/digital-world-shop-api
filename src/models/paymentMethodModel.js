'use strict'

import { model, Schema } from 'mongoose'
import { COLLECTION_NAMES, MODEL_NAMES, PAYMENT_METHODS } from '~/utils/constants'

const paymentMethodSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: MODEL_NAMES.USER,
    required: true
  },
  methodType: {
    type: String,
    enum: [PAYMENT_METHODS.MOMO, PAYMENT_METHODS.PAYPAL, PAYMENT_METHODS.CASH],
    required: true
  },
  paymentToken: {
    type: String, // token or id from paypal and momo
    default: null
  },
  lastUsedAt: {
    type: Date,
    default: null
  },
  providerData: {
    type: Schema.Types.Mixed,
    default: null
  }
}, {
  timestamps: true,
  collection: COLLECTION_NAMES.PAYMENT_METHOD
})

export default model(MODEL_NAMES.PAYMENT_METHOD, paymentMethodSchema)
