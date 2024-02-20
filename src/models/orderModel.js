import { Schema, model } from 'mongoose'
import {
  COLLECTION_NAMES,
  MODEL_NAMES,
  ORDER_STATUSES,
  PAYMENT_METHODS
} from '~/utils/constants'

const orderSchema = new Schema({
  orderBy: {
    type: Schema.Types.ObjectId,
    ref: MODEL_NAMES.USER,
    required: true
  },
  orderProducts: [{
    productId: { type: Schema.Types.ObjectId, required: true },
    variantId: { type: Schema.Types.ObjectId, required: true },
    quantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    totalPriceApplyDiscount: { type: Number, required: true }
  }],
  totalPrice: { type: Number, required: true },
  totalPriceApplyDiscount: { type: Number, required: true },
  shippingAddress: {
    type: Schema.Types.ObjectId,
    ref: MODEL_NAMES.ADDRESS,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: Object.values(PAYMENT_METHODS),
    default: PAYMENT_METHODS.COD
  },
  status: {
    type: String,
    enum: Object.values(ORDER_STATUSES),
    default: ORDER_STATUSES.PENDING
  },
  statusHistory: [
    {
      status: {
        type: String,
        enum: Object.values(ORDER_STATUSES),
        required: true
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ]
}, {
  versionKey: false,
  timestamps: true,
  collation: { locale: 'en' },
  collection: COLLECTION_NAMES.ORDER
})

export default model(MODEL_NAMES.ORDER, orderSchema)
