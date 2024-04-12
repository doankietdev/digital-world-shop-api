import { Schema, model } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import { COLLECTION_NAMES, MODEL_NAMES, ROLES } from '~/utils/constants'
import { generateDBErrorMessage } from '~/utils/formatter'

const blogSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      minLength: [2, generateDBErrorMessage('must have a minimum length of 2')],
      required: [
        true,
        generateDBErrorMessage('is required', { showValue: false })
      ]
    },
    slug: {
      type: String,
      trim: true,
      minLength: [2, generateDBErrorMessage('must have a minimum length of 2')],
      unique: true,
      required: [
        true,
        generateDBErrorMessage('is required', { showValue: false })
      ]
    },
    description: {
      type: String,
      trim: true,
      minLength: [
        10,
        generateDBErrorMessage('must have a minimum length of 10')
      ],
      required: [
        true,
        generateDBErrorMessage('is required', { showValue: false })
      ]
    },
    category: { type: Schema.Types.ObjectId },
    numberViews: {
      type: Number,
      min: [0, generateDBErrorMessage('must be at least 0')],
      default: 0
    },
    likes: [{ type: Schema.Types.ObjectId, ref: MODEL_NAMES.USER }],
    dislikes: [{ type: Schema.Types.ObjectId, ref: MODEL_NAMES.USER }],
    image: { type: String, default: null },
    author: { type: String, default: ROLES.ADMIN }
  },
  {
    versionKey: false,
    timestamps: true,
    collation: { locale: 'en' },
    collection: COLLECTION_NAMES.BLOG
  }
)

blogSchema.plugin(uniqueValidator, {
  message: generateDBErrorMessage('already exists')
})

export default model(MODEL_NAMES.BLOG, blogSchema)
