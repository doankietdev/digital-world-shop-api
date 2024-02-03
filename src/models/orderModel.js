import { Schema, model } from 'mongoose'
import {
  COLLECTION_NAMES,
  MODEL_NAMES,
  ORDER_STATUSES,
  PAYMENT_METHODS,
  DISCOUNT_TYPES
} from '~/utils/constants'

const orderSchema = new Schema({
  orderBy: {
    type: Schema.Types.ObjectId,
    ref: MODEL_NAMES.USER,
    required: true
  },
  products: [{
    product: { type: Schema.Types.ObjectId, ref: MODEL_NAMES.PRODUCT, required: true },
    oldPrice: { type: Number, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    discounts: [{
      code: { type: String, unique: true, uppercase: true, required: true },
      name: { type: String, required: true },
      type: {
        type: String,
        enum: Object.values(DISCOUNT_TYPES),
        required: true
      },
      value: { type: Number, required: true }
    }]
  }],
  totalPrice: { type: Number, required: true },
  status: {
    type: String,
    enum: Object.values(ORDER_STATUSES),
    default: ORDER_STATUSES.PENDING
  },
  shippingAddress: {
    province: { type: String, required: true },
    district: { type: String, required: true },
    ward: { type: String, required: true },
    street: { type: String, default: null },
    apartmentNumber: { type: String, default: null }
  },
  paymentMethod: {
    type: String,
    enum: Object.values(PAYMENT_METHODS),
    default: PAYMENT_METHODS.COD
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
