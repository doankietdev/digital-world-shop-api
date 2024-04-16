import { Schema, model } from 'mongoose'
import { COLLECTION_NAMES, MODEL_NAMES } from '~/utils/constants'
import { generateDBErrorMessage } from '~/utils/formatter'

const tokenSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: MODEL_NAMES.USER,
      required: [
        true,
        generateDBErrorMessage('is required', { showValue: false })
      ]
    },
    accessToken: {
      type: String,
      required: [
        true,
        generateDBErrorMessage('is required', { showValue: false })
      ]
    },
    refreshToken: {
      type: String,
      required: [
        true,
        generateDBErrorMessage('is required', { showValue: false })
      ]
    }
  },
  {
    versionKey: false,
    timestamps: true,
    collection: COLLECTION_NAMES.AUTHENTICATION_TOKEN
  }
)

export default model(MODEL_NAMES.AUTHENTICATION_TOKEN, tokenSchema)
