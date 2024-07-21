import { Schema, model } from 'mongoose'
import { COLLECTION_NAMES, MODEL_NAMES } from '~/utils/constants'
import { generateDBErrorMessage } from '~/utils/formatter'
import { PHONE_NUMBER_RULE } from '~/utils/validators'

const addressSchema = new Schema(
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
    phoneNumber: {
      type: String,
      trim: true,
      required: true,
      validate: {
        validator: function (value) {
          return PHONE_NUMBER_RULE.test(value)
        },
        message: generateDBErrorMessage('must be exactly 10 digits')
      }
    },
    provinceId: {
      type: Number,
      required: [
        true,
        generateDBErrorMessage('is required', { showValue: false })
      ]
    },
    districtId: {
      type: Number,
      required: [
        true,
        generateDBErrorMessage('is required', { showValue: false })
      ]
    },
    wardCode: {
      type: String,
      required: [
        true,
        generateDBErrorMessage('is required', { showValue: false })
      ]
    },
    streetAddress: {
      type: String,
      trim: true,
      minLength: [2, generateDBErrorMessage('must have a minimum length of 2')],
      default: null
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: MODEL_NAMES.USER,
      required: [
        true,
        generateDBErrorMessage('is required', { showValue: false })
      ]
    }
  },
  {
    versionKey: false,
    timestamps: true,
    collation: { locale: 'en' },
    collection: COLLECTION_NAMES.ADDRESS
  }
)

export default model(MODEL_NAMES.ADDRESS, addressSchema)
