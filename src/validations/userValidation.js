import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import asyncHandler from '~/utils/asyncHandler'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE, PASSWORD_RULE, PASSWORD_RULE_MESSAGES } from '~/utils/validators'
import { ROLES } from '~/utils/constants'
import { findFileFromReqFiles } from '~/utils/util'

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
    firstName: Joi.string().min(1),
    lastName: Joi.string().min(2)
  })

  try {
    await correctCondition.validateAsync(
      req.body,
      { abortEarly: false }
    )
    next()
  } catch (error) {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message)
  }
})

const uploadAvatarForCurrentUser = asyncHandler(async (req, res, next) => {
  try {
    const correctCondition = Joi.object({
      image: Joi.object().required()
    })
    await correctCondition.validateAsync({
      image: findFileFromReqFiles(req.files, 'image')
    })
    next()
  } catch (error) {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message)
  }
})

const changePassword = asyncHandler(async (req, res, next) => {
  try {
    const correctCondition = Joi.object({
      currentPassword: Joi.string().required(),
      newPassword: Joi.string()
        .min(6)
        .regex(PASSWORD_RULE)
        .messages({
          'string.min': PASSWORD_RULE_MESSAGES.MIN_LENGTH,
          'string.pattern.base': PASSWORD_RULE_MESSAGES.SPECIAL_CHAR
        })
        .required()
    })
    await correctCondition.validateAsync(req.body, { abortEarly: false })
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
  uploadAvatarForCurrentUser,
  changePassword,
  setBlocked,
  deleteUser
}