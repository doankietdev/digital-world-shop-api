import { Schema, model } from 'mongoose'
import { COLLECTION_NAMES, MODEL_NAMES } from '~/utils/constants'

const variantSchema = new Schema({
  name: { type: String, default: null },
  images: { type: Array, default: [] },
  quantity: { type: Number, default: 0 }
}, {
  versionKey: false,
  collation: { locale: 'en' }
})

const ratingSchema = new Schema({
  _id: false,
  star: { type: Number, required: true },
  postedBy: {
    type: Schema.Types.ObjectId,
    ref: MODEL_NAMES.USER,
    required: true
  },
  comment: { type: String, default: null }
}, {
  versionKey: false,
  timestamps: true,
  collation: { locale: 'en' },
  _id: false
})

const productSchema = new Schema({
  title: { type: String, trim: true, required: true },
  slug: { type: String, unique: true, required: true },
  description: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  category: {
    type: Schema.Types.ObjectId,
    ref: MODEL_NAMES.PRODUCT_CATEGORY,
    required: true
  },
  sold: { type: Number, default: 0 },
  variants: [variantSchema],
  ratings: [ratingSchema],
  averageRatings: { type: Number, default: 0 }
}, {
  versionKey: false,
  timestamps: true,
  collation: { locale: 'en' },
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  id: false,
  collection: COLLECTION_NAMES.PRODUCT
})

productSchema.virtual('quantity').get(function() {
  return this.variants?.reduce((acc, variant) => acc += variant.quantity, 0)
})

export default model(MODEL_NAMES.PRODUCT, productSchema)
