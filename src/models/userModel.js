import { Schema, model } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import { isEmail } from 'validator'
import { COLLECTION_NAMES, MODEL_NAMES, ROLES } from '~/utils/constants'
import { generateDBErrorMessage } from '~/utils/formatter'
import { PHONE_NUMBER_RULE } from '~/utils/validators'

const userSchema = new Schema(
  {
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
          required: [
            true,
            generateDBErrorMessage('is required', { showValue: false })
          ]
        }
      },
      default: null,
      _id: false
    },
    mobile: {
      type: String,
      trim: true,
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
      required: [
        true,
        generateDBErrorMessage('is required', { showValue: false })
      ]
    },
    passwordHistory: [{
      password: {
        type: String,
        trim: true,
        required: [
          true,
          generateDBErrorMessage('is required', { showValue: false })
        ]
      },
      changedAt: {
        type: Date,
        default: Date.now
      },
      _id: false
    }],
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
    verificationToken: {
      type: {
        token: {
          type: String,
          required: [
            true,
            generateDBErrorMessage('is required', { showValue: false })
          ]
        },
        expiresAt: {
          type: Date,
          required: [
            true,
            generateDBErrorMessage('is required', { showValue: false })
          ]
        },
        _id: false
      },
      default: null
    },
    passwordResetOTP: {
      type: {
        otp: {
          type: String,
          required: [
            true,
            generateDBErrorMessage('is required', { showValue: false })
          ]
        },
        expiresAt: {
          type: Date,
          required: [
            true,
            generateDBErrorMessage('is required', { showValue: false })
          ]
        }
      },
      default: null
    },
    passwordResetToken: {
      type: {
        token: {
          type: String,
          required: [
            true,
            generateDBErrorMessage('is required', { showValue: false })
          ]
        },
        expiresAt: {
          type: Date,
          required: [
            true,
            generateDBErrorMessage('is required', { showValue: false })
          ]
        }
      },
      default: null
    },
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
    accessTokens: { type: Array, default: [] },
    refreshTokens: { type: Array, default: [] },
    usedRefreshTokens: { type: Array, default: [] }
  },
  {
    versionKey: false,
    timestamps: true,
    collation: { locale: 'en' },
    collection: COLLECTION_NAMES.USER
  }
)

// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) {
//     next()
//   }
//   this.password = await hash(this.password)
// })

userSchema.plugin(uniqueValidator, {
  message: generateDBErrorMessage('already exists')
})

export default model(MODEL_NAMES.USER, userSchema)
