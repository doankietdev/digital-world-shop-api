import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import ApiError from '~/utils/ApiError'
import asyncHandler from '~/utils/asyncHandler'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const createNew = asyncHandler(async (req, res, next) => {
  const correctCondition = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    category: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    numberViews: Joi.number(),
    likes: Joi.array().items(
      Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
    ),
    dislikes: Joi.array().items(
      Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
    ),
    image: Joi.string(),
    author: Joi.string()
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message)
  }
})

const getBlog = asyncHandler(async (req, res, next) => {
  const correctCondition = Joi.object({
    id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required()
  })

  try {
    await correctCondition.validateAsync(req.params)
    next()
  } catch (error) {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message)
  }
})

const updateBlog = asyncHandler(async (req, res, next) => {
  const correctCondition = Joi.object({
    id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
    title: Joi.string(),
    description: Joi.string(),
    category: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    image: Joi.string(),
    author: Joi.string()
  })

  try {
    await correctCondition.validateAsync({ ...req.params, ...req.body }, {
      abortEarly: false
    })
    next()
  } catch (error) {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message)
  }
})


const deleteBlog = asyncHandler(async (req, res, next) => {
  const correctCondition = Joi.object({
    id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required()
  })

  try {
    await correctCondition.validateAsync(req.params)
    next()
  } catch (error) {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message)
  }
})

const like = asyncHandler(async (req, res, next) => {
  const correctCondition = Joi.object({
    id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required()
  })

  try {
    await correctCondition.validateAsync(req.params)
    next()
  } catch (error) {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message)
  }
})

const dislike = asyncHandler(async (req, res, next) => {
  const correctCondition = Joi.object({
    id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required()
  })

  try {
    await correctCondition.validateAsync(req.params)
    next()
  } catch (error) {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message)
  }
})

export default {
  createNew,
  getBlog,
  updateBlog,
  deleteBlog,
  like,
  dislike
}