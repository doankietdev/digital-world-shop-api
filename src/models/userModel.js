import { Schema, model } from 'mongoose'
import { hashPassword } from '~/utils/auth'
import { ROLES, COLLECTION_NAMES, MODEL_NAMES } from '~/utils/constants'

const imageSchema = new Schema({
  url: { type: String, required: true },
  id: { type: String, required: true }
}, {
  _id: false,
  versionKey: false
})

const productInCartSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: MODEL_NAMES.PRODUCT,
    required: true
  },
  quantity: { type: Number, required: true }
}, {
  _id: false,
  versionKey: false
})

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  image: { type: imageSchema, default: null },
  mobile: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: ROLES.CUSTOMER, enum: Object.values(ROLES) },
  cart: [productInCartSchema],
  addresses: [{ type: Schema.Types.ObjectId, ref: MODEL_NAMES.ADDRESS }],
  wishlist: [{ type: Schema.Types.ObjectId, ref: MODEL_NAMES.PRODUCT }],
  isBlocked: { type: Boolean, default: false },
  passwordChangedAt: { type: Date, default: null },
  passwordResetToken: { type: String, default: null },
  publicKey: { type: String, required: true },
  privateKey: { type: String, required: true },
  usedRefreshTokens: { type: Array, default: [] }
}, {
  versionKey: false,
  timestamps: true,
  collation: { locale: 'en' },
  collection: COLLECTION_NAMES.USER
})

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next()
  }
  this.password = await hashPassword(this.password)
})

export default model(MODEL_NAMES.USER, userSchema)
