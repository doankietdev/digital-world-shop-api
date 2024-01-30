import { Schema, model } from 'mongoose'
import { USER_MODEL_NAME } from './userModel'

export const TOKEN_COLLECTION_NAME = 'keyTokens'
export const TOKEN_MODEL_NAME = 'KeyToken'

const tokenSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: USER_MODEL_NAME, required: true },
  accessToken: { type: String, required: true },
  refreshToken: { type: String, required: true }
}, {
  versionKey: false,
  timestamps: true,
  collection: TOKEN_COLLECTION_NAME
})

export default model(TOKEN_MODEL_NAME, tokenSchema)
