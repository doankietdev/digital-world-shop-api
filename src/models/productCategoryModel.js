import { Schema, model } from 'mongoose'
import { COLLECTION_NAMES, MODEL_NAMES } from '~/utils/constants'

const productCategorySchema = new Schema(
  {
    title: { type: String, unique: true, index: true, required: true },
    slug: { type: String, unique: true, index: true, required: true }
  },
  {
    versionKey: false,
    timestamps: true,
    collation: { locale: 'en' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
    collection: COLLECTION_NAMES.PRODUCT_CATEGORY
  }
)

productCategorySchema.virtual('products', {
  ref: MODEL_NAMES.PRODUCT,
  localField: '_id',
  foreignField: 'category'
})

export default model(MODEL_NAMES.PRODUCT_CATEGORY, productCategorySchema)
