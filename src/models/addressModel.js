import { Schema, model } from 'mongoose'
import { COLLECTION_NAMES, MODEL_NAMES, ROLES } from '~/utils/constants'

const blogSchema = new Schema({
  province: { type: String, required: true },
  district: { type: String, required: true },
  ward: { type: String, required: true },
  street: { type: String, default: null },
  apartmentNumber: { type: String, default: null },
  userId: { type: Schema.Types.ObjectId, ref: MODEL_NAMES.USER, default: null }
}, {
  versionKey: false,
  timestamps: true,
  collation: { locale: 'en' },
  collection: COLLECTION_NAMES.ADDRESS
})

export default model(MODEL_NAMES.ADDRESS, blogSchema)
