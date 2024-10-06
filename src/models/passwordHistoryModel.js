import { Schema, model } from 'mongoose'
import { COLLECTION_NAMES, MODEL_NAMES } from '~/utils/constants'
import { generateDBErrorMessage } from '~/utils/formatter'

const passwordHistory = new Schema(
  {
    password: {
      type: String,
      trim: true,
      required: [
        true,
        generateDBErrorMessage('is required', { showValue: false })
      ]
    },
    userId: { type: Schema.Types.ObjectId, ref: MODEL_NAMES.USER }
  },
  {
    versionKey: false,
    timestamps: true,
    collation: { locale: 'en' },
    collection: COLLECTION_NAMES.PASSWORD_HISTORY
  }
)

export default model(MODEL_NAMES.PASSWORD_HISTORY, passwordHistory)
