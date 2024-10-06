import { Schema, model } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import { isEmail } from 'validator'
import { COLLECTION_NAMES, MODEL_NAMES, ROLES } from '~/utils/constants'
import { generateDBErrorMessage } from '~/utils/formatter'

const userSchema = new Schema(
  {
    googleId: {
      type: String,
      trim: true,
      default: null
    },
    firstName: {
      type: String,
      trim: true,
      minLength: [1, generateDBErrorMessage('must have a minimum length of 1')],
      required: true
    },
    lastName: {
      type: String,
      trim: true,
      minLength: [2, generateDBErrorMessage('must have a minimum length of 2')],
      required: [
        true,
        generateDBErrorMessage('is required', { showValue: false })
      ]
    },
    image: {
      type: {
        url: {
          type: String,
          trim: true,
          required: [
            true,
            generateDBErrorMessage('is required', { showValue: false })
          ]
        },
        id: {
          type: String,
          trim: true,
          default: null
        }
      },
      default: null,
      _id: false
    },
    email: {
      type: String,
      trim: true,
      validate: [isEmail, generateDBErrorMessage('is a invalid email')],
      required: true,
      unique: true
    },
    defaultAddress: {
      type: Schema.Types.ObjectId,
      ref: MODEL_NAMES.ADDRESS,
      default: null
    },
    password: {
      type: String,
      trim: true,
      default: null
    },
    role: {
      type: String,
      trim: true,
      default: ROLES.CUSTOMER,
      enum: {
        values: Object.values(ROLES),
        message: generateDBErrorMessage('is invalid')
      }
    },
    blocked: { type: Boolean, default: false },
    verified: {
      type: Boolean,
      default: false
    },
    usedRefreshTokens: { type: Array, default: [] }
  },
  {
    versionKey: false,
    timestamps: true,
    collation: { locale: 'en' },
    collection: COLLECTION_NAMES.USER
  }
)

userSchema.plugin(uniqueValidator, {
  message: generateDBErrorMessage('already exists')
})

export default model(MODEL_NAMES.USER, userSchema)
