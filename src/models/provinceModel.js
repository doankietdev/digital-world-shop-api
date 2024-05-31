import { Schema, model } from 'mongoose'
import { COLLECTION_NAMES, MODEL_NAMES } from '~/utils/constants'
import { generateDBErrorMessage } from '~/utils/formatter'

const provinceSchema = new Schema(
  {
    _id: {
      type: Number,
      required: [
        true,
        generateDBErrorMessage('is required', { showValue: false })
      ]
    },
    code: {
      type: String,
      trim: true,
      unique: true,
      required: [
        true,
        generateDBErrorMessage('is required', { showValue: false })
      ]
    },
    name: {
      type: String,
      trim: true,
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
    collection: COLLECTION_NAMES.PROVINCE
  }
)

export default model(MODEL_NAMES.PROVINCE, provinceSchema)
