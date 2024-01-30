import { Schema, model } from 'mongoose'
import { COLLECTION_NAMES, MODEL_NAMES } from '~/utils/constants'

const productCategorySchema = new Schema({
  title: { type: String, unique: true, index: true, required: true }
}, {
  versionKey: false,
  timestamps: true,
  collation: { locale: 'en' },
  collection: COLLECTION_NAMES.PRODUCT_CATEGORY
})

export default model(MODEL_NAMES.PRODUCT_CATEGORY, productCategorySchema)
