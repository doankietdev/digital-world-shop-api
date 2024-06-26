import { Schema, model } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import { COLLECTION_NAMES, MODEL_NAMES } from '~/utils/constants'
import { generateDBErrorMessage } from '~/utils/formatter'

const categorySchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      minLength: [2, generateDBErrorMessage('must have a minimum length of 2')],
      unique: true,
      required: [
        true,
        generateDBErrorMessage('is required', { showValue: false })
      ]
    },
    slug: {
      type: String,
      trim: true,
      unique: true,
      minLength: [2, generateDBErrorMessage('must have a minimum length of 2')],
      required: [
        true,
        generateDBErrorMessage('is required', { showValue: false })
      ]
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

categorySchema.virtual('products', {
  ref: MODEL_NAMES.PRODUCT,
  localField: '_id',
  foreignField: 'category'
})

categorySchema.plugin(uniqueValidator, {
  message: generateDBErrorMessage('already exists')
})

export default model(MODEL_NAMES.CATEGORY, categorySchema)
