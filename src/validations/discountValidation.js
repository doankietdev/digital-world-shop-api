import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import asyncHandler from '~/utils/asyncHandler'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { DISCOUNT_APPLY_TYPES, DISCOUNT_TYPES } from '~/utils/constants'

const createNew = asyncHandler(async (req, res, next) => {
  const correctCondition = Joi.object({
    code: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string(),
    type: Joi.string().valid(...Object.values(DISCOUNT_TYPES)),
    value: Joi.number().required(),
    maxUsage: Joi.number(),
    expireAt: Joi.date().required(),
    applyTypes: Joi.string().valid(...Object.values(DISCOUNT_APPLY_TYPES)),
    applicableProducts: Joi.array().items(
      Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
    ),
    applicableCategories: Joi.array().items(
      Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
    ),
    isActive: Joi.boolean()
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message)
  }
})

const getDiscount = asyncHandler(async (req, res, next) => {
  const correctCondition = Joi.object({
    id: Joi.string()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE)
      .required()
  })

  try {
    await correctCondition.validateAsync(req.params)
    next()
  } catch (error) {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message)
  }
})

const updateDiscount = asyncHandler(async (req, res, next) => {
  const correctCondition = Joi.object({
    id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
    code: Joi.string(),
    name: Joi.string(),
    description: Joi.string(),
    type: Joi.string().valid(...Object.values(DISCOUNT_TYPES)),
    value: Joi.number(),
    maxUsage: Joi.number(),
    expireAt: Joi.date(),
    applyTypes: Joi.string().valid(...Object.values(DISCOUNT_APPLY_TYPES)),
    applicableProducts: Joi.array().items(
      Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
    ).unique(),
    applicableCategories: Joi.array().items(
      Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
    ).unique(),
    isActive: Joi.boolean()
  })

  try {
    await correctCondition.validateAsync({ ...req.params, ...req.body }, { abortEarly: false })
    next()
  } catch (error) {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message)
  }
})

const deleteDiscount = asyncHandler(async (req, res, next) => {
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

export default {
  createNew,
  getDiscount,
  updateDiscount,
  deleteDiscount
}
