import { Schema, model } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import { COLLECTION_NAMES, MODEL_NAMES } from '~/utils/constants'
import { generateDBErrorMessage } from '~/utils/formatter'

// Schema.Types.Subdocument.set('_id', false)

const productSchema = new Schema(
  {
    title: {
      type: String,
      minLength: [2, generateDBErrorMessage('must have a minimum length of 2')],
      trim: true,
      required: [
        true,
        generateDBErrorMessage('is required', { showValue: false })
      ]
    },
    slug: {
      type: String,
      minLength: [2, generateDBErrorMessage('must have a minimum length of 2')],
      trim: true,
      unique: true,
      required: [
        true,
        generateDBErrorMessage('is required', { showValue: false })
      ]
    },
    description: {
      type: String,
      minLength: [
        10,
        generateDBErrorMessage('must have a minimum length of 10')
      ],
      trim: true,
      required: [
        true,
        generateDBErrorMessage('is required', { showValue: false })
      ]
    },
    brand: {
      type: Schema.Types.ObjectId,
      ref: MODEL_NAMES.BRAND,
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
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: MODEL_NAMES.CATEGORY,
      required: [
        true,
        generateDBErrorMessage('is required', { showValue: false })
      ]
    },
    sold: {
      type: Number,
      min: [0, generateDBErrorMessage('must be at least 0')],
      default: 0
    },
    thumb: {
      type: {
        url: {
          type: String,
          trim: true,
          minLength: [
            3,
            generateDBErrorMessage('must have a minimum length of 3')
          ],
          required: [
            true,
            generateDBErrorMessage('is required', { showValue: false })
          ]
        },
        id: {
          type: String,
          trim: true,
          required: [
            true,
            generateDBErrorMessage('is required', { showValue: false })
          ]
        }
      },
      default: null,
      _id: false
    },
    variants: [
      new Schema(
        {
          name: {
            type: String,
            minLength: [
              2,
              generateDBErrorMessage('must have a minimum length of 2')
            ],
            trim: true,
            required: [
              true,
              generateDBErrorMessage('is required', { showValue: false })
            ]
          },
          images: { type: Array, default: [] },
          quantity: {
            type: Number,
            min: [0, generateDBErrorMessage('must be at least 0')],
            default: 0
          }
        },
        {
          versionKey: false,
          timestamps: true,
          id: false,
          collation: { locale: 'en' }
        }
      )
    ],
    specs: {
      type: Array,
      default: []
    },
    ratings: [
      new Schema(
        {
          _id: false,
          star: {
            type: Number,
            min: [1, generateDBErrorMessage('Must be at least 1')],
            max: [5, generateDBErrorMessage('Must be at most 5')],
            required: [
              true,
              generateDBErrorMessage('is required', { showValue: false })
            ]
          },
          postedBy: {
            type: Schema.Types.ObjectId,
            ref: MODEL_NAMES.USER,
            required: [
              true,
              generateDBErrorMessage('is required', { showValue: false })
            ]
          },
          comment: {
            type: String,
            trim: true,
            minLength: [
              1,
              generateDBErrorMessage('must have a minimum length of 1')
            ],
            default: null
          }
        },
        {
          versionKey: false,
          timestamps: true,
          collation: { locale: 'en' },
          _id: false
        }
      )
    ],
    averageRatings: { type: Number, default: 0 }
  },
  {
    versionKey: false,
    timestamps: true,
    collation: { locale: 'en' },
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    id: false,
    collection: COLLECTION_NAMES.PRODUCT
  }
)

productSchema.index({ 'specs.k': 1, 'specs.v': 1 })

productSchema.virtual('quantity').get(function () {
  return this.variants?.reduce((acc, variant) => (acc += variant.quantity), 0)
})

productSchema.plugin(uniqueValidator, {
  message: generateDBErrorMessage('already exists')
})

export default model(MODEL_NAMES.PRODUCT, productSchema)
