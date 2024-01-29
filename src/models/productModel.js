import { Schema, model } from 'mongoose'
import { PRODUCT_COLORS } from '~/utils/constants'

const COLLECTION_NAME = 'products'
const DOCUMENT_NAME = 'Product'

const productSchema = new Schema({
  title: { type: String, trim: true, required: true },
  slug: { type: String, unique: true, required: true },
  description: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
  quantity: { type: Number, default: 0 },
  sold: { type: Number, default: 0 },
  images: { type: Array, default: [] },
  color: { type: String, enum: PRODUCT_COLORS, default: null },
  ratings: [
    {
      _id: false,
      star: { type: Number, required: true },
      postedBy: { type: Schema.Types.ObjectId, ref: 'User', unique: true, required: true },
      comment: { type: String, default: null }
    }
  ],
  averageRatings: { type: Number, default: 0 }
}, {
  versionKey: false,
  timestamps: true,
  collation: { locale: 'en' },
  collection: COLLECTION_NAME
})
export default model(DOCUMENT_NAME, productSchema)
