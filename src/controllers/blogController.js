import { StatusCodes } from 'http-status-codes'
import blogService from '~/services/blogService'
import SuccessResponse from '~/utils/SuccessResponse'
import asyncHandler from '~/utils/asyncHandler'

const createNew = asyncHandler(async (req, res) => {
  new SuccessResponse({
    statusCode: StatusCodes.CREATED,
    message: 'Create new blog successfully',
    metadata: {
      blog: await blogService.createNew(req.body)
    }
  }).send(res)
})

const getBlog = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Get blog successfully',
    metadata: {
      blog: await blogService.getBlog(req.params.id, req.query)
    }
  }).send(res)
})

const getBlogs = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Get blogs successfully',
    metadata: {
      ...await blogService.getBlogs(req.query)
    }
  }).send(res)
})

const updateBlog = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Update blog successfully',
    metadata: {
      blog: await blogService.updateBlog(req.params.id, req.body)
    }
  }).send(res)
})

const deleteBlog = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Delete blog successfully',
    metadata: {
      blog: await blogService.deleteBlog(req.params.id)
    }
  }).send(res)
})

const like = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Update like blog successfully',
    metadata: {
      blog: await blogService.like(req.params.id, req.user?._id)
    }
  }).send(res)
})

const dislike = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Update dislike blog successfully',
    metadata: {
      blog: await blogService.dislike(req.params.id, req.user?._id)
    }
  }).send(res)
})

export default {
  createNew,
  getBlog,
  getBlogs,
  updateBlog,
  deleteBlog,
  like,
  dislike
}
