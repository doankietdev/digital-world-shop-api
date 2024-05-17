import { Schema, model } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import { COLLECTION_NAMES, MODEL_NAMES } from '~/utils/constants'
import { generateDBErrorMessage } from '~/utils/formatter'

const cartSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: MODEL_NAMES.USER,
      unique: true,
      required: [
        true,
        generateDBErrorMessage('is required', { showValue: false })
      ]
    },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: MODEL_NAMES.PRODUCT,
          required: [
            true,
            generateDBErrorMessage('is required', { showValue: false })
          ]
        },
        variantId: {
          type: Schema.Types.ObjectId,
          required: [
            true,
            generateDBErrorMessage('is required', { showValue: false })
          ]
        },
        quantity: {
          type: Number,
          min: [1, generateDBErrorMessage('must be at least 0')],
          required: [
            true,
            generateDBErrorMessage('is required', { showValue: false })
          ]
        },
        _id: false
      }
    ],
    countProducts: {
      type: Number,
      min: [0, generateDBErrorMessage('must be at least 0')],
      default: 0
    }
  },
  {
    versionKey: false,
    timestamps: true,
    collation: { locale: 'en' },
    collection: COLLECTION_NAMES.CART
  }
)

cartSchema.plugin(uniqueValidator, {
  message: generateDBErrorMessage('already exists')
})

export default model(MODEL_NAMES.CART, cartSchema)
