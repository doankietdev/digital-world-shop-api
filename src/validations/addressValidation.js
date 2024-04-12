import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import asyncHandler from '~/utils/asyncHandler'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const createNew = asyncHandler(async (req, res, next) => {
  const correctCondition = Joi.object({
    province: Joi.string().min(2).required(),
    district: Joi.string().min(2).required(),
    ward: Joi.string().min(2).required(),
    street: Joi.string().min(2),
    apartmentNumber: Joi.string().min(2)
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message)
  }
})

const getAddress = asyncHandler(async (req, res, next) => {
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

const updateAddressForCurrentUser = asyncHandler(async (req, res, next) => {
  const correctCondition = Joi.object({
    addressId: Joi.string()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE)
      .required(),
    province: Joi.string().min(2),
    district: Joi.string().min(2),
    ward: Joi.string().min(2),
    street: Joi.string().min(2),
    apartmentNumber: Joi.string().min(2)
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
  getAddress,
  updateAddressForCurrentUser,
  deleteAddressForCurrentUser
}
