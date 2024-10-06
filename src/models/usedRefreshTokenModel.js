'use strict'

import { model, Schema } from 'mongoose'
import { AUTH } from '~/configs/environment'
import { COLLECTION_NAMES, MODEL_NAMES } from '~/utils/constants'

const usedRefreshTokenSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: MODEL_NAMES.USER, required: true },
    code: { type: String, required: true }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAMES.USED_REFRESH_TOKEN
  }
)

usedRefreshTokenSchema.index(
  { updatedAt: 1 },
  { expireAfterSeconds: AUTH?.REFRESH_TOKEN_LIFE / 1000 }
)

export default model(MODEL_NAMES.USED_REFRESH_TOKEN, usedRefreshTokenSchema)
