import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import asyncHandler from '~/utils/asyncHandler'

const signUp = asyncHandler(async (req, res, next) => {
  const correctCondition = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    mobile: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
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
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message)
  }
})

export default {
  signUp,
  signIn
}