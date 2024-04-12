import { Schema, model } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import { COLLECTION_NAMES, MODEL_NAMES } from '~/utils/constants'
import { generateDBErrorMessage } from '~/utils/formatter'

const productCategorySchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      minLength: [2, generateDBErrorMessage('must have a minimum length of 2')],
      unique: true,
      required: true
    },
    slug: {
      type: String,
      trim: true,
      unique: true,
      minLength: [2, generateDBErrorMessage('must have a minimum length of 2')],
      required: true
    }
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

productCategorySchema.plugin(uniqueValidator, {
  message: generateDBErrorMessage('already exists')
})

export default model(MODEL_NAMES.PRODUCT_CATEGORY, productCategorySchema)
