import { Schema, model } from 'mongoose'
import { COLLECTION_NAMES, DISCOUNT_TYPES, MODEL_NAMES, PRODUCT_COLORS } from '~/utils/constants'

const productSchema = new Schema({
  title: { type: String, trim: true, required: true },
  slug: { type: String, unique: true, required: true },
  description: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  category: {
    type: Schema.Types.ObjectId,
    ref: MODEL_NAMES.PRODUCT_CATEGORY,
    default: null
  },
  quantity: { type: Number, default: 0 },
  sold: { type: Number, default: 0 },
  images: { type: Array, default: [] },
  color: { type: String, enum: PRODUCT_COLORS, default: null },
  ratings: [
    {
      _id: false,
      star: { type: Number, required: true },
      postedBy: {
        type: Schema.Types.ObjectId,
        ref: MODEL_NAMES.USER,
        required: true
      },
      comment: { type: String, default: null }
    }
  ],
  averageRatings: { type: Number, default: 0 }
}, {
  versionKey: false,
  timestamps: true,
  collation: { locale: 'en' },
  collection: COLLECTION_NAMES.PRODUCT
})


export default model(MODEL_NAMES.PRODUCT, productSchema)
