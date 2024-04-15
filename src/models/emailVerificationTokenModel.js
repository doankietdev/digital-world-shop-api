import { Schema, model } from 'mongoose'
import { generateDBErrorMessage } from '~/utils/formatter'
import { AUTH } from '~/configs/environment'
import { COLLECTION_NAMES, MODEL_NAMES } from '~/utils/constants'

const emailVerificationTokenSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: MODEL_NAMES.USER,
      required: [
        true,
        generateDBErrorMessage('is required', { showValue: false })
      ]
    },
    token: {
      type: String,
      trim: true,
      required: [
        true,
        generateDBErrorMessage('is required', { showValue: false })
      ]
    },
    expireAt: {
      type: Date,
      default: function () {
        return Date.now() + AUTH.EMAIL_VERIFICATION_TOKEN_TIME
      },
      immutable: true // prevent provide value for expireAt when update
    }
  },
  {
    versionKey: false,
    collection: COLLECTION_NAMES.EMAIL_VERIFICATION_TOKEN,
    timestamps: true,
    collation: { locale: 'en' }
  }
)

emailVerificationTokenSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: AUTH.EMAIL_VERIFICATION_TOKEN_TIME / 1000 }
)

export default model(
  MODEL_NAMES.EMAIL_VERIFICATION_TOKEN,
  emailVerificationTokenSchema
)
