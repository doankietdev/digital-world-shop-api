import { Schema, model } from 'mongoose'
import {
  COLLECTION_NAMES,
  MODEL_NAMES,
  ORDER_STATUSES,
  PAYMENT_METHODS
} from '~/utils/constants'
import { generateDBErrorMessage } from '~/utils/formatter'

const orderSchema = new Schema(
  {
    orderBy: {
      type: Schema.Types.ObjectId,
      ref: MODEL_NAMES.USER,
      required: [
        true,
        generateDBErrorMessage('is required', { showValue: false })
      ]
    },
    orderProducts: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          required: [
            true,
            generateDBErrorMessage('is required', { showValue: false })
          ]
        },
        variantId: {
          type: Schema.Types.ObjectId,
          required: [
            true,
            generateDBErrorMessage('is required', { showValue: false })
          ]
        },
        quantity: {
          type: Number,
          min: [0, generateDBErrorMessage('must be at least 0')],
          required: [
            true,
            generateDBErrorMessage('is required', { showValue: false })
          ]
        },
        totalPrice: {
          type: Number,
          min: [0, generateDBErrorMessage('must be at least 0')],
          required: [
            true,
            generateDBErrorMessage('is required', { showValue: false })
          ]
        },
        totalPriceApplyDiscount: {
          type: Number,
          min: [0, generateDBErrorMessage('must be at least 0')],
          required: [
            true,
            generateDBErrorMessage('is required', { showValue: false })
          ]
        }
      }
    ],
    totalPrice: {
      type: Number,
      min: [0, generateDBErrorMessage('must be at least 0')],
      required: [
        true,
        generateDBErrorMessage('is required', { showValue: false })
      ]
    },
    totalPriceApplyDiscount: {
      type: Number,
      min: [0, generateDBErrorMessage('must be at least 0')],
      required: [
        true,
        generateDBErrorMessage('is required', { showValue: false })
      ]
    },
    shippingAddress: {
      type: Schema.Types.ObjectId,
      ref: MODEL_NAMES.ADDRESS,
      required: [
        true,
        generateDBErrorMessage('is required', { showValue: false })
      ]
    },
    paymentMethod: {
      type: String,
      trim: true,
      enum: {
        values: Object.values(PAYMENT_METHODS),
        message: generateDBErrorMessage('is invalid')
      },
      default: PAYMENT_METHODS.COD
    },
    status: {
      type: String,
      trim: true,
      enum: {
        values: Object.values(ORDER_STATUSES),
        message: generateDBErrorMessage('is invalid')
      },
      default: ORDER_STATUSES.PENDING
    },
    statusHistory: [
      {
        status: {
          type: String,
          trim: true,
          enum: {
            values: Object.values(ORDER_STATUSES),
            message: generateDBErrorMessage('is invalid')
          },
          required: [
            true,
            generateDBErrorMessage('is required', { showValue: false })
          ]
        },
        date: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  {
    versionKey: false,
    timestamps: true,
    collation: { locale: 'en' },
    collection: COLLECTION_NAMES.ORDER
  }
)

export default model(MODEL_NAMES.ORDER, orderSchema)
