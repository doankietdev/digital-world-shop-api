import { Schema, model } from 'mongoose'
import { COLLECTION_NAMES, DISCOUNT_APPLY_TYPES, DISCOUNT_TYPES, MODEL_NAMES } from '~/utils/constants'

const discountSchema = new Schema({
  code: { type: String, unique: true, uppercase: true, required: true },
  name: { type: String, required: true },
  description: { type: String },
  type: {
    type: String,
    enum: Object.values(DISCOUNT_TYPES),
    default: DISCOUNT_TYPES.PERCENTAGE
  },
  value: { type: Number, required: true },
  maxUsage: { type: Number, default: null },
  expireAt: { type: Date, required: true },
  applyFor: {
    type: String,
    enum: Object.values(DISCOUNT_APPLY_TYPES),
    default: DISCOUNT_APPLY_TYPES.SPECIFIC
  },
  applicableProducts: [{
    type: Schema.Types.ObjectId,
    ref: MODEL_NAMES.PRODUCT
  }],
  applicableCategories: [{
    type: Schema.Types.ObjectId,
    ref: MODEL_NAMES.PRODUCT_CATEGORY
  }],
  isActive: { type: Boolean, default: false }
}, {
  versionKey: false,
  collation: { locale: 'en' },
  timestamps: true,
  collection: COLLECTION_NAMES.DISCOUNT
})

export default model(MODEL_NAMES.DISCOUNT, discountSchema)
