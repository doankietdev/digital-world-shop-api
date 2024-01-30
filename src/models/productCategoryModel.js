import { Schema, model } from 'mongoose'

export const PRODUCT_CATEGORY_COLLECTION_NAME = 'productCategories'
export const PRODUCT_CATEGORY_MODEL_NAME = 'ProductCategory'

const productCategorySchema = new Schema({
  title: { type: String, unique: true, index: true, required: true }
}, {
  versionKey: false,
  timestamps: true,
  collation: { locale: 'en' },
  collection: PRODUCT_CATEGORY_COLLECTION_NAME
})

export default model(PRODUCT_CATEGORY_MODEL_NAME, productCategorySchema)
