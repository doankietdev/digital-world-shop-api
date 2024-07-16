import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import ApiError from '~/utils/ApiError'
import asyncHandler from '~/utils/asyncHandler'
import { HEADER_KEYS } from '~/utils/constants'
import {
  OBJECT_ID_RULE,
  OBJECT_ID_RULE_MESSAGE,
  PASSWORD_RULE,
  PASSWORD_RULE_MESSAGES,
  PHONE_NUMBER_RULE,
  PHONE_NUMBER_RULE_MESSAGE
} from '~/utils/validators'

const signUp = asyncHandler(async (req, res, next) => {
  const correctCondition = Joi.object({
    firstName: Joi.string().min(1).required(),
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

const verifyEmail = asyncHandler(async (req, res, next) => {
  const correctCondition = Joi.object({
    email: Joi.string().email().required(),
    token: Joi.string().required()
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
    email: Joi.string().email().required(),
    otp: Joi.string().required()
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message)
  }
})

const resetPassword = asyncHandler(async (req, res, next) => {
  const correctCondition = Joi.object({
    email: Joi.string().email().required(),
    newPassword: Joi.string()
      .min(6)
      // .regex(PASSWORD_RULE)
      // .messages({
      //   'string.min': PASSWORD_RULE_MESSAGES.MIN_LENGTH,
      //   'string.pattern.base': PASSWORD_RULE_MESSAGES.SPECIAL_CHAR
      // })
      .required()
  })

  try {
    await correctCondition.validateAsync(req.body)
    next()
  } catch (error) {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message)
  }
})

const refreshToken = asyncHandler(async (req, res, next) => {
  const correctCondition = Joi.object({
    [HEADER_KEYS.USER_ID]: Joi.string()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE)
      .required(),
    accessToken: Joi.string().required(),
    refreshToken: Joi.string().required()
  })

  try {
    await correctCondition.validateAsync(
      {
        ...req.body,
        [HEADER_KEYS.AUTHORIZATION]: req.headers[HEADER_KEYS.AUTHORIZATION].substring('Bearer '.length)
      },
      { abortEarly: false }
    )
    next()
  } catch (error) {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message)
  }
})

export default {
  signUp,
  verifyEmail,
  signIn,
  forgotPassword,
  verifyPasswordResetOtp,
  resetPassword,
  refreshToken
}
