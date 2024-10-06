import { Schema, model } from 'mongoose'
import { AUTH } from '~/configs/environment'
import { COLLECTION_NAMES, MODEL_NAMES } from '~/utils/constants'

const emailTokenSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: MODEL_NAMES.USER, unique: true, required: true },
    code: { type: String, required: true },
    expiresAt: {
      type: Date,
      default: Date.now() + AUTH.EMAIL_VERIFICATION_TOKEN_LIFE
    }
  },
  {
    versionKey: false,
    timestamps: true,
    collation: { locale: 'en' },
    collection: COLLECTION_NAMES.EMAIL_TOKEN
  }
)

emailTokenSchema.index(
  { updatedAt: 1 },
  { expireAfterSeconds: AUTH.EMAIL_VERIFICATION_TOKEN_LIFE / 1000 }
)

export default model(MODEL_NAMES.EMAIL_TOKEN, emailTokenSchema)
