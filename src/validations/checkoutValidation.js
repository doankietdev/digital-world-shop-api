import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import asyncHandler from '~/utils/asyncHandler'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const review = asyncHandler(async (req, res, next) => {
  const correctCondition = Joi.object({
    orderProducts: Joi.array()
      .items(
        Joi.object({
          productId: Joi.string()
            .pattern(OBJECT_ID_RULE)
            .message(OBJECT_ID_RULE_MESSAGE)
            .required(),
          variantId: Joi.string()
            .pattern(OBJECT_ID_RULE)
            .message(OBJECT_ID_RULE_MESSAGE)
            .required(),
          oldPrice: Joi.number().min(0).required().allow(null),
          price: Joi.number().min(0).required(),
          quantity: Joi.number().min(0).required()
        })
      )
      .required(),
    _currency: Joi.string().allow('VND')
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message)
  }
})

const order = asyncHandler(async (req, res, next) => {
  const correctCondition = Joi.object({
    orderProducts: Joi.array()
      .items(
        Joi.object({
          productId: Joi.string()
            .pattern(OBJECT_ID_RULE)
            .message(OBJECT_ID_RULE_MESSAGE)
            .required(),
          variantId: Joi.string()
            .pattern(OBJECT_ID_RULE)
            .message(OBJECT_ID_RULE_MESSAGE)
            .required(),
          oldPrice: Joi.number().min(0).required(),
          price: Joi.number().min(0).required(),
          quantity: Joi.number().min(0).required()
        })
      )
      .required(),
    paymentMethod: Joi.string().required()
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message)
  }
})

export default {
  review,
  order
}
