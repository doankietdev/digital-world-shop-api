import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import asyncHandler from '~/utils/asyncHandler'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { ROLES } from '~/utils/constants'

const updateCurrentUser = asyncHandler(async (req, res, next) => {
  const correctCondition = Joi.object({
    firstName: Joi.string(),
    lastName: Joi.string(),
    mobile: Joi.string(),
    password: Joi.string().min(6)
  })

  try {
    await correctCondition.validateAsync(req.body, {
      abortEarly: false,
      allowUnknown: true
    })
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
    role: Joi.string().valid(Object.values(ROLES))
  })

  try {
    await correctCondition.validateAsync(req.body, {
      abortEarly: false,
      allowUnknown: true
    })
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
  updateCurrentUser,
  updateUser,
  setBlocked,
  deleteUser
}