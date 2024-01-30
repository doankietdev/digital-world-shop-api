import { Schema, model } from 'mongoose'

const COLLECTION_NAME = 'productCategories'
const DOCUMENT_NAME = 'ProductCategory'

const productCategorySchema = new Schema({
  title: { type: String, unique: true, index: true, required: true }
}, {
  versionKey: false,
  timestamps: true,
  collation: { locale: 'en' },
  collection: COLLECTION_NAME
})

export default model(DOCUMENT_NAME, productCategorySchema)
