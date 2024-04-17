import { Schema, model } from 'mongoose'
import { generateDBErrorMessage } from '~/utils/formatter'
import { AUTH } from '~/configs/environment'
import { COLLECTION_NAMES, MODEL_NAMES } from '~/utils/constants'

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
    otp: {
      type: String,
      trim: true,
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
        return Date.now() + AUTH.PASSWORD_RESET_OTP_TIME
      },
      immutable: true // prevent provide value for expireAt when update
    }
  },
  {
    versionKey: false,
    collection: COLLECTION_NAMES.PASSWORD_RESET_OTP,
    timestamps: true,
    collation: { locale: 'en' }
  }
)

passwordResetOtpSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: AUTH.PASSWORD_RESET_OTP_TIME / 1000 }
)

export default model(
  MODEL_NAMES.PASSWORD_RESET_OTP,
  passwordResetOtpSchema
)
