import { Schema, model } from 'mongoose'

const COLLECTION_NAME = 'keyTokens'
const DOCUMENT_NAME = 'KeyToken'

const tokenSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  accessToken: { type: String, required: true },
  refreshToken: { type: String, required: true }
}, {
  versionKey: false,
  timestamps: true,
  collection: COLLECTION_NAME
})

export default model(DOCUMENT_NAME, tokenSchema)
