import { Schema, model } from 'mongoose'
import { COLLECTION_NAMES, MODEL_NAMES } from '~/utils/constants'
import { generateDBErrorMessage } from '~/utils/formatter'

const orderStatusSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      required: [
        true,
        generateDBErrorMessage('is required', { showValue: false })
      ]
    },
    description: {
      type: String,
      trim: true,
      default: null
    }
  },
  {
    versionKey: false,
    timestamps: true,
    collation: { locale: 'en' },
    collection: COLLECTION_NAMES.ORDER_STATUS
  }
)

export default model(MODEL_NAMES.ORDER_STATUS, orderStatusSchema)
