import { Schema, model } from 'mongoose'
import { COLLECTION_NAMES, MODEL_NAMES } from '~/utils/constants'
import { generateDBErrorMessage } from '~/utils/formatter'

const addressSchema = new Schema(
  {
    provinceId: {
      type: Number,
      required: [
        true,
        generateDBErrorMessage('is required', { showValue: false })
      ]
    },
    districtId: {
      type: Number,
      required: [
        true,
        generateDBErrorMessage('is required', { showValue: false })
      ]
    },
    wardCode: {
      type: String,
      required: [
        true,
        generateDBErrorMessage('is required', { showValue: false })
      ]
    },
    streetAddress: {
      type: String,
      trim: true,
      minLength: [2, generateDBErrorMessage('must have a minimum length of 2')],
      default: null
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: MODEL_NAMES.USER,
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
    collection: COLLECTION_NAMES.ADDRESS
  }
)

export default model(MODEL_NAMES.ADDRESS, addressSchema)
