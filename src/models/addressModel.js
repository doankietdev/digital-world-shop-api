import { Schema, model } from 'mongoose'
import { COLLECTION_NAMES, MODEL_NAMES } from '~/utils/constants'
import { generateDBErrorMessage } from '~/utils/formatter'
import orderModel from './orderModel'

const addressSchema = new Schema(
  {
    provinceId: {
      type: Number,
      ref: MODEL_NAMES.PROVINCE,
      required: [
        true,
        generateDBErrorMessage('is required', { showValue: false })
      ]
    },
    districtId: {
      type: Number,
      ref: MODEL_NAMES.DISCOUNT,
      required: [
        true,
        generateDBErrorMessage('is required', { showValue: false })
      ]
    },
    wardId: {
      type: Number,
      ref: MODEL_NAMES.WARD,
      required: [
        true,
        generateDBErrorMessage('is required', { showValue: false })
      ]
    },
    streetAddress: {
      type: String,
      trim: true,
      minLength: [2, generateDBErrorMessage('must have a minimum length of 2')],
      required: [
        true,
        generateDBErrorMessage('is required', { showValue: false })
      ]
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: MODEL_NAMES.USER,
      validate: {
        validator: async function (value) {
          const foundUser = await orderModel.findOne({ userId: value })
          return !foundUser
        },
        message: generateDBErrorMessage('is required', { showValue: false })
      }
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
