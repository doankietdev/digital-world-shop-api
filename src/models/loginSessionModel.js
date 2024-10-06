'use strict'

import { model, Schema } from 'mongoose'
import { AUTH } from '~/configs/environment'
import { COLLECTION_NAMES, MODEL_NAMES } from '~/utils/constants'

const loginSessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: MODEL_NAMES.USER
    },
    publicKey: {
      type: String,
      required: true
    },
    browser: {
      type: {
        name: { type: String, trim: true, default: '' },
        version: { type: String, trim: true, default: '' },
        _id: false
      },
      required: true
    },
    os: {
      type: {
        name: { type: String, trim: true, default: '' },
        version: { type: String, trim: true, default: '' },
        _id: false
      },
      required: true
    },
    device: {
      type: {
        deviceType: { type: String, trim: true, default: '' },
        model: { type: String, trim: true, default: '' },
        vendor: { type: String, trim: true, default: '' },
        _id: false
      },
      required: true
    },
    ip: { type: String, default: '' }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAMES.LOGIN_SESSION
  }
)

loginSessionSchema.index(
  { updatedAt: 1 },
  { expireAfterSeconds: AUTH.REFRESH_TOKEN_LIFE / 1000 }
)

export default model(MODEL_NAMES.LOGIN_SESSION, loginSessionSchema)
