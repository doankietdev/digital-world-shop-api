import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import ApiError from '~/utils/ApiError'
import asyncHandler from '~/utils/asyncHandler'
import {
  PASSWORD_RULE,
  PASSWORD_RULE_MESSAGES,
  PHONE_NUMBER_RULE,
  PHONE_NUMBER_RULE_MESSAGE
} from '~/utils/validators'

const signUp = asyncHandler(async (req, res, next) => {
  const correctCondition = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().min(2).required(),
    mobile: Joi.string()
      .pattern(PHONE_NUMBER_RULE)
      .message(PHONE_NUMBER_RULE_MESSAGE('mobile'))
      .required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .min(6)
      .regex(PASSWORD_RULE)
      .messages({
        'string.min': PASSWORD_RULE_MESSAGES.MIN_LENGTH,
        'string.pattern.base': PASSWORD_RULE_MESSAGES.SPECIAL_CHAR
      })
      .required()
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message)
  }
})

const signIn = asyncHandler(async (req, res, next) => {
  const correctCondition = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required()
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message)
  }
})

const forgotPassword = asyncHandler(async (req, res, next) => {
  const correctCondition = Joi.object({
    email: Joi.string().email().required()
  })

  try {
    await correctCondition.validateAsync(req.body)
    next()
  } catch (error) {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message)
  }
})

const verifyPasswordResetOtp = asyncHandler(async (req, res, next) => {
  const correctCondition = Joi.object({
    otp: Joi.string().required()
  })

  try {
    await correctCondition.validateAsync(req.body)
    next()
  } catch (error) {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message)
  }
})

const resetPassword = asyncHandler(async (req, res, next) => {
  const correctCondition = Joi.object({
    newPassword: Joi.string()
      .min(6)
      .regex(PASSWORD_RULE)
      .messages({
        'string.min': PASSWORD_RULE_MESSAGES.MIN_LENGTH,
        'string.pattern.base': PASSWORD_RULE_MESSAGES.SPECIAL_CHAR
      })
      .required()
  })

  try {
    await correctCondition.validateAsync(req.body)
    next()
  } catch (error) {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message)
  }
})

export default {
  signUp,
  signIn,
  forgotPassword,
  verifyPasswordResetOtp,
  resetPassword
}
