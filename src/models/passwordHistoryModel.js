import { Schema, model } from 'mongoose'
import { generateDBErrorMessage } from '~/utils/formatter'
import { COLLECTION_NAMES, MODEL_NAMES } from '~/utils/constants'

const passwordHistorySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: MODEL_NAMES.USER,
      required: [
        true,
        generateDBErrorMessage('is required', { showValue: false })
      ]
    },
    password: {
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
    collection: COLLECTION_NAMES.PASSWORD_HISTORY,
    timestamps: true,
    collation: { locale: 'en' }
  }
)

export default model(
  MODEL_NAMES.PASSWORD_HISTORY,
  passwordHistorySchema
)
