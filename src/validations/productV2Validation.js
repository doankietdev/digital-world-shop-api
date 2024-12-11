import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import ApiError from '~/utils/ApiError'
import asyncHandler from '~/utils/asyncHandler'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const getProduct = asyncHandler(async (req, res, next) => {
  const correctCondition = Joi.object({
    id: Joi.string()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE)
      .required(),
    _currency: Joi.string().allow('VND')
  })

  try {
    await correctCondition.validateAsync({
      ...req.params,
      ...req.query
    }, { abortEarly: false })
    next()
  } catch (error) {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message)
  }
})

const getProductBySlug = asyncHandler(async (req, res, next) => {
  const correctCondition = Joi.object({
    _currency: Joi.string().allow('VND')
  })

  try {
    await correctCondition.validateAsync({
      ...req.query
    }, { abortEarly: false, allowUnknown: true })
    next()
  } catch (error) {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message)
  }
})

const search = asyncHandler(async (req, res, next) => {
  const correctCondition = Joi.object({
    q: Joi.string().required(),
    _currency: Joi.string().allow('VND')
  })
  try {
    await correctCondition.validateAsync(
      req.query,
      {
        abortEarly: false,
        allowUnknown: true
      }
    )
    next()
  } catch (error) {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message)
  }
})

const getProducts = asyncHandler(async (req, res, next) => {
  const correctCondition = Joi.object({
    _currency: Joi.string().allow('VND')
  })
  try {
    await correctCondition.validateAsync(
      req.query,
      {
        abortEarly: false,
        allowUnknown: true
      }
    )
    next()
  } catch (error) {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message)
  }
})

export default {
  getProduct,
  getProductBySlug,
  getProducts,
  search
}
