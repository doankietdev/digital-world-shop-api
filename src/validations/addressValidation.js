import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import asyncHandler from '~/utils/asyncHandler'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE, PHONE_NUMBER_RULE, PHONE_NUMBER_RULE_MESSAGE } from '~/utils/validators'

const createNew = asyncHandler(async (req, res, next) => {
  const correctCondition = Joi.object({
    firstName: Joi.string().min(1).required(),
    lastName: Joi.string().min(2).required(),
    phoneNumber: Joi.string()
      .pattern(PHONE_NUMBER_RULE)
      .message(PHONE_NUMBER_RULE_MESSAGE('mobile'))
      .required(),
    provinceId: Joi.number().required(),
    districtId: Joi.number().required(),
    wardCode: Joi.string().required(),
    streetAddress: Joi.string().min(2).allow(null),
    setAsDefault: Joi.boolean()
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message)
  }
})

const updateAddressForCurrentUser = asyncHandler(async (req, res, next) => {
  const correctCondition = Joi.object({
    addressId: Joi.string()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE)
      .required(),
    firstName: Joi.string().min(1),
    lastName: Joi.string().min(2),
    phoneNumber: Joi.string()
      .pattern(PHONE_NUMBER_RULE)
      .message(PHONE_NUMBER_RULE_MESSAGE('mobile')),
    provinceId: Joi.number(),
    districtId: Joi.number().when('provinceId', {
      is: Joi.exist(),
      then: Joi.required(),
      otherwise: Joi.optional()
    }),
    wardCode: Joi.string().when('districtId', {
      is: Joi.exist(),
      then: Joi.required(),
      otherwise: Joi.optional()
    }),
    streetAddress: Joi.string().min(2).allow(null),
    setAsDefault: Joi.boolean()
  })

  try {
    await correctCondition.validateAsync(
      { ...req.body, ...req.params },
      { abortEarly: false }
    )
    next()
  } catch (error) {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message)
  }
})

const deleteAddressForCurrentUser = asyncHandler(async (req, res, next) => {
  const correctCondition = Joi.object({
    addressId: Joi.string()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE)
      .required()
  })

  try {
    await correctCondition.validateAsync({ ...req.params })
    next()
  } catch (error) {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message)
  }
})

export default {
  createNew,
  updateAddressForCurrentUser,
  deleteAddressForCurrentUser
}
