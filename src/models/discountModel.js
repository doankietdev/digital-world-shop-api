import { Schema, model } from 'mongoose'
import {
  COLLECTION_NAMES,
  DISCOUNT_APPLY_TYPES,
  DISCOUNT_TYPES,
  MODEL_NAMES
} from '~/utils/constants'
import { generateDBErrorMessage } from '~/utils/formatter'

const discountSchema = new Schema(
  {
    code: {
      type: String,
      trim: true,
      unique: true,
      minLength: [2, generateDBErrorMessage('must have a minimum length of 2')],
      required: true
    },
    name: {
      type: String,
      trim: true,
      minLength: [2, generateDBErrorMessage('must have a minimum length of 2')],
      required: true
    },
    description: {
      type: String,
      trim: true,
      minLength: [
        10,
        generateDBErrorMessage('must have a minimum length of 10')
      ],
      default: null
    },
    type: {
      type: String,
      trim: true,
      enum: {
        values: Object.values(DISCOUNT_TYPES),
        message: generateDBErrorMessage('is invalid')
      },
      default: DISCOUNT_TYPES.PERCENTAGE
    },
    value: {
      type: Number,
      min: [0, generateDBErrorMessage('must be at least 0')],
      required: [true, generateDBErrorMessage('is required')]
    },
    maxUsage: {
      type: Number,
      min: [0, generateDBErrorMessage('must be at least 0')],
      default: null
    },
    currentUsage: {
      type: Number,
      min: [0, generateDBErrorMessage('must be at least 0')],
      default: null
    },
    expireAt: {
      type: Date,
      required: [
        true,
        generateDBErrorMessage('is required', { showValue: false })
      ],
      validate: {
        validator: function (value) {
          return value > new Date()
        },
        message: generateDBErrorMessage('must be greater than the current time')
      }
    },
    applyFor: {
      type: String,
      trim: true,
      enum: {
        values: Object.values(DISCOUNT_APPLY_TYPES),
        message: generateDBErrorMessage('is invalid')
      },
      default: DISCOUNT_APPLY_TYPES.SPECIFIC
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: MODEL_NAMES.PRODUCT
      }
    ],
    isActive: { type: Boolean, default: false }
  },
  {
    versionKey: false,
    collation: { locale: 'en' },
    timestamps: true,
    collection: COLLECTION_NAMES.DISCOUNT
  }
)

export default model(MODEL_NAMES.DISCOUNT, discountSchema)
