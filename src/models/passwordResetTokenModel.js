import { Schema, model } from 'mongoose'
import { AUTH } from '~/configs/environment'
import { COLLECTION_NAMES, MODEL_NAMES } from '~/utils/constants'
import { generateDBErrorMessage } from '~/utils/formatter'

const passwordResetOtpSchema = new Schema(
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
    code: {
      type: String,
      required: [
        true,
        generateDBErrorMessage('is required', { showValue: false })
      ]
    },
    expiresAt: {
      type: Date,
      default: Date.now() + AUTH.PASSWORD_RESET_TOKEN_LIFE
    }
  },
  {
    versionKey: false,
    timestamps: true,
    collation: { locale: 'en' },
    collection: COLLECTION_NAMES.PASSWORD_RESET_TOKEN
  }
)

passwordResetOtpSchema.index(
  { updatedAt: 1 },
  { expireAfterSeconds: AUTH.PASSWORD_RESET_TOKEN_LIFE / 1000 }
)

export default model(MODEL_NAMES.PASSWORD_RESET_TOKEN, passwordResetOtpSchema)
