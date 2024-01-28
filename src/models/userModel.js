import { Schema, model } from 'mongoose'
import { hashPassword } from '~/auth'
import { ROLES } from '~/utils/constants'

const COLLECTION_NAME = 'users'
const DOCUMENT_NAME = 'User'

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  mobile: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: ROLES.CUSTOMER },
  cart: { type: Array, default: [] },
  address: [{ type: Schema.Types.ObjectId, ref: 'Address' }],
  wishlist: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  isBlocked: { type: Boolean, default: false },
  passwordChangedAt: { type: Date, default: null },
  passwordResetToken: { type: String, default: null },
  publicKey: { type: String, required: true },
  privateKey: { type: String, required: true },
  usedRefreshTokens: { type: Array, default: [] }
}, {
  versionKey: false,
  timestamps: true,
  collection: COLLECTION_NAME
})

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }
  this.password = await hashPassword(this.password)
})

export default model(DOCUMENT_NAME, userSchema)
