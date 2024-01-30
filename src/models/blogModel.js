import { Schema, model } from 'mongoose'
import { ROLES } from '~/utils/constants'
import { USER_MODEL_NAME } from './userModel'

export const BLOG_COLLECTION_NAME = 'blogs'
export const BLOG_MODEL_NAME = 'Blog'

const blogSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true, index: true, required: true },
  description: { type: String, required: true },
  category: { type: Schema.Types.ObjectId },
  numberViews: { type: Number, default: 0 },
  likes: [{ type: Schema.Types.ObjectId, ref: USER_MODEL_NAME }],
  dislikes: [{ type: Schema.Types.ObjectId, ref: USER_MODEL_NAME }],
  image: { type: String, default: 'https://images.unsplash.com/photo-1432821596592-e2c18b78144f?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmxvZyUyMGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D' },
  author: { type: String, default: ROLES.ADMIN }
}, {
  versionKey: false,
  timestamps: true,
  collation: { locale: 'en' },
  collection: BLOG_COLLECTION_NAME
})

export default model(BLOG_MODEL_NAME, blogSchema)
