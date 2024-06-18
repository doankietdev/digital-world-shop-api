import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import asyncHandler from '~/utils/asyncHandler'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { ROLES } from '~/utils/constants'

const getUser = asyncHandler(async (req, res, next) => {
  const correctCondition = Joi.object({
    id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required()
  })

  try {
    await correctCondition.validateAsync({ ...req.params }, {
      abortEarly: false,
      allowUnknown: true
    })
    next()
  } catch (error) {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message)
  }
})

const setDefaultAddress = asyncHandler(async (req, res, next) => {
  const correctCondition = Joi.object({
    addressId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required()
  })

  try {
    await correctCondition.validateAsync({ ...req.body })
    next()
  } catch (error) {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message)
  }
})

const updateCurrentUser = asyncHandler(async (req, res, next) => {
  const correctCondition = Joi.object({
    firstName: Joi.string(),
    lastName: Joi.string(),
    mobile: Joi.string(),
    password: Joi.string().min(6),
    image: Joi.object()
  })

  try {
    await correctCondition.validateAsync(
      { ...req.body, image: req.file },
      { abortEarly: false }
    )
    next()
  } catch (error) {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message)
  }
})

const updateUser = asyncHandler(async (req, res, next) => {
  const correctCondition = Joi.object({
    firstName: Joi.string(),
    lastName: Joi.string(),
    mobile: Joi.string(),
    password: Joi.string().min(6),
    role: Joi.string().valid(...Object.values(ROLES)),
    image: Joi.object()
  })

  try {
    await correctCondition.validateAsync(
      { ...req.body, image: req.file },
      { abortEarly: false }
    )
    next()
  } catch (error) {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message)
  }
})

const setBlocked = asyncHandler(async (req, res, next) => {
  const correctCondition = Joi.object({
    id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
    blocked: Joi.boolean().required()
  })

  try {
    await correctCondition.validateAsync({ ...req.params, ...req.body }, {
      abortEarly: false,
      allowUnknown: true
    })
    next()
  } catch (error) {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message)
  }
})

const deleteUser = asyncHandler(async (req, res, next) => {
  const correctCondition = Joi.object({
    id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required()
  })

  try {
    await correctCondition.validateAsync({ ...req.params }, {
      abortEarly: false,
      allowUnknown: true
    })
    next()
  } catch (error) {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message)
  }
})

export default {
  getUser,
  setDefaultAddress,
  updateCurrentUser,
  updateUser,
  setBlocked,
  deleteUser
}