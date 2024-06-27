import { Schema, model } from 'mongoose'
import { COLLECTION_NAMES, MODEL_NAMES } from '~/utils/constants'
import { generateDBErrorMessage } from '~/utils/formatter'

const paymentMethodSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      minLength: [2, generateDBErrorMessage('must have a minimum length of 2')],
      unique: true,
      required: [
        true,
        generateDBErrorMessage('is required', { showValue: false })
      ]
    },
    description: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    versionKey: false,
    timestamps: true,
    collation: { locale: 'en' },
    collection: COLLECTION_NAMES.PAYMENT_METHOD
  }
)

export default model(MODEL_NAMES.PAYMENT_METHOD, paymentMethodSchema)
