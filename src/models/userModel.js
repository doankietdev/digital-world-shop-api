import { isEmail } from 'validator'
import uniqueValidator from 'mongoose-unique-validator'
import { Schema, model } from 'mongoose'
import { hashPassword } from '~/utils/auth'
import { ROLES, COLLECTION_NAMES, MODEL_NAMES } from '~/utils/constants'
import { generateDBErrorMessage } from '~/utils/formatter'
import { PHONE_NUMBER_RULE } from '~/utils/validators'

const imageSchema = new Schema(
  {
    url: {
      type: String,
      required: [
        true,
        generateDBErrorMessage('is required', { showValue: false })
      ]
    },
    id: {
      type: String,
      required: [
        true,
        generateDBErrorMessage('is required', { showValue: false })
      ]
    }
  },
  {
    _id: false,
    versionKey: false
  }
)

const productInCartSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: MODEL_NAMES.PRODUCT,
      required: [
        true,
        generateDBErrorMessage('is required', { showValue: false })
      ]
    },
    quantity: {
      type: Number,
      required: [
        true,
        generateDBErrorMessage('is required', { showValue: false })
      ]
    }
  },
  {
    _id: false,
    versionKey: false
  }
)

const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: {
      type: String,
      minLength: [2, generateDBErrorMessage('must have a minimum length of 2')],
      required: [
        true,
        generateDBErrorMessage('is required', { showValue: false })
      ]
    },
    image: { type: imageSchema, default: null },
    mobile: {
      type: String,
      required: [
        true,
        generateDBErrorMessage('is required', { showValue: false })
      ],
      unique: true,
      validate: {
        validator: function (value) {
          return PHONE_NUMBER_RULE.test(value)
        },
        message: generateDBErrorMessage('must be exactly 10 digits')
      }
    },
    email: {
      type: String,
      validate: [isEmail, generateDBErrorMessage('is a invalid email')],
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: [
        true,
        generateDBErrorMessage('is required', { showValue: false })
      ]
    },
    role: {
      type: String,
      default: ROLES.CUSTOMER,
      enum: {
        values: Object.values(ROLES),
        message: generateDBErrorMessage('is invalid')
      }
    },
    cart: [productInCartSchema],
    addresses: [{ type: Schema.Types.ObjectId, ref: MODEL_NAMES.ADDRESS }],
    wishlist: [{ type: Schema.Types.ObjectId, ref: MODEL_NAMES.PRODUCT }],
    isBlocked: { type: Boolean, default: false },
    passwordChangedAt: { type: Date, default: null },
    passwordResetToken: { type: String, default: null },
    publicKey: {
      type: String,
      required: [
        true,
        generateDBErrorMessage('is required', { showValue: false })
      ]
    },
    privateKey: {
      type: String,
      required: [
        true,
        generateDBErrorMessage('is required', { showValue: false })
      ]
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

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }
  this.password = await hashPassword(this.password)
})

userSchema.plugin(uniqueValidator, {
  message: generateDBErrorMessage('already exists')
})

export default model(MODEL_NAMES.USER, userSchema)
