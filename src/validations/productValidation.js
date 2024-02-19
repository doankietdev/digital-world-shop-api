import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import asyncHandler from '~/utils/asyncHandler'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { PRODUCT_COLORS } from '~/utils/constants'

const createNew = asyncHandler(async (req, res, next) => {
  const correctCondition = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    brand: Joi.string().required(),
    price: Joi.number().required(),
    category: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required()
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message)
  }
})

const getProduct = asyncHandler(async (req, res, next) => {
  const correctCondition = Joi.object({
    id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required()
  })

  try {
    await correctCondition.validateAsync(req.params)
    next()
  } catch (error) {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message)
  }
})

const updateProduct = asyncHandler(async (req, res, next) => {
  const correctCondition = Joi.object({
    id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
    title: Joi.string(),
    description: Joi.string(),
    brand: Joi.string(),
    price: Joi.number(),
    category: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  })

  try {
    await correctCondition.validateAsync(
      { ...req.params, ...req.body },
      { abortEarly: false }
    )
    next()
  } catch (error) {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message)
  }
})

const deleteProduct = asyncHandler(async (req, res, next) => {
  const correctCondition = Joi.object({
    id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required()
  })

  try {
    await correctCondition.validateAsync(req.params)
    next()
  } catch (error) {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message)
  }
})

const rating = asyncHandler(async (req, res, next) => {
  const correctCondition = Joi.object({
    productId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
    star: Joi.number().required(),
    comment: Joi.string()
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message)
  }
})

const addVariant = asyncHandler(async (req, res, next) => {
  const correctCondition = Joi.object({
    id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
    color: Joi.string(),
    images: Joi.array(),
    quantity: Joi.number()
  })
  try {
    await correctCondition.validateAsync({ ...req.files.images, ...req.body, ...req.params }, {
      abortEarly: false
    })
    next()
  } catch (error) {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message)
  }
})

export default {
  createNew,
  getProduct,
  updateProduct,
  deleteProduct,
  rating,
  addVariant
}