import { Schema, model } from 'mongoose'
import {
  COLLECTION_NAMES,
  MODEL_NAMES,
  ORDER_STATUSES,
  PAYMENT_METHODS
} from '~/utils/constants'
import {
  convertObjectToArrayValues,
  generateDBErrorMessage
} from '~/utils/formatter'

const orderSchema = new Schema(
  {
    products: [
      {
        _id: false,
        product: {
          type: Schema.Types.ObjectId,
          ref: MODEL_NAMES.PRODUCT,
          required: [
            true,
            generateDBErrorMessage('is required', { showValue: false })
          ]
        },
        variant: {
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
        oldPrice: {
          type: Number,
          min: [0, generateDBErrorMessage('must be at least 0')],
          required: [
            true,
            generateDBErrorMessage('is required', { showValue: false })
          ]
        },
        price: {
          type: Number,
          min: [0, generateDBErrorMessage('must be at least 0')],
          required: [
            true,
            generateDBErrorMessage('is required', { showValue: false })
          ]
        }
      }
    ],
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
      enum: convertObjectToArrayValues(PAYMENT_METHODS),
      required: [
        true,
        generateDBErrorMessage('is required', { showValue: false })
      ]
    },
    shippingFee: {
      type: Number,
      min: [0, generateDBErrorMessage('must be at least 0')],
      default: null
    },
    status: {
      type: String,
      enum: convertObjectToArrayValues(ORDER_STATUSES),
      default: ORDER_STATUSES.PENDING
    },
    statusHistory: [
      {
        status: {
          type: String,
          enum: convertObjectToArrayValues(PAYMENT_METHODS),
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
    ],
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
    id: false,
    versionKey: false,
    timestamps: true,
    collation: { locale: 'en' },
    collection: COLLECTION_NAMES.ORDER
  }
)

orderSchema.virtual('totalProductsPrice').get(function () {
  return this.products.reduce(
    (acc, product) => acc + product.price * product.quantity,
    0
  )
})

orderSchema.virtual('totalPayment').get(function () {
  if (this.shippingFee) {
    return this.totalProductsPrice + this.shippingFee
  }
  return this.totalProductsPrice
})

export default model(MODEL_NAMES.ORDER, orderSchema)
