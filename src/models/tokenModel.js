import { Schema, model } from 'mongoose'
import { COLLECTION_NAMES, MODEL_NAMES } from '~/utils/constants'

const tokenSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: MODEL_NAMES.USER, required: true },
  accessToken: { type: String, required: true },
  refreshToken: { type: String, required: true }
}, {
  versionKey: false,
  timestamps: true,
  collection: COLLECTION_NAMES.TOKEN
})

export default model(MODEL_NAMES.TOKEN, tokenSchema)
