import { StatusCodes } from 'http-status-codes'
import blogModel from '~/models/blogModel'
import ApiError from '~/utils/ApiError'
import { generateSlug, parseQueryParams } from '~/utils/formatter'
import { calculateTotalPages } from '~/utils/util'

const createNew = async (reqBody) => {
  try {
    return await blogModel.create({
      ...reqBody,
      slug: generateSlug(reqBody.title)
    })
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Create new blog failed')
  }
}

const getBlog = async (id, reqQuery) => {
  try {
    const { fields } = parseQueryParams(reqQuery)
    const SELECT_USER_FIELDS = '_id firstName lastName'

    const blog = await blogModel
      .findByIdAndUpdate(
        id,
        { $inc: { numberViews: 1 } },
        { new: true }
      )
      .select(fields)
      .populate({
        path: 'likes',
        select: SELECT_USER_FIELDS
      })
      .populate({
        path: 'dislikes',
        select: SELECT_USER_FIELDS
      })
    if (!blog) throw new ApiError(StatusCodes.NOT_FOUND, 'Blog not found')
    return blog
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Get blog failed')
  }
}

const getBlogs = async (reqQuery) => {
  try {
    const { query, sort, fields, skip, limit, page } = parseQueryParams(reqQuery)
    const SELECT_USER_FIELDS = '_id firstName lastName'

    const [blogs, totalBlogs] = await Promise.all([
      blogModel
        .find(query)
        .sort(sort)
        .select(fields)
        .skip(skip)
        .limit(limit)
        .populate({
          path: 'likes',
          select: SELECT_USER_FIELDS
        })
        .populate({
          path: 'dislikes',
          select: SELECT_USER_FIELDS
        }),
      blogModel.countDocuments()
    ])
    return {
      page,
      totalPages: calculateTotalPages(totalBlogs, limit),
      totalBlogs,
      blogs
    }

  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Get blogs failed')
  }
}

const updateBlog = async (id, reqBody) => {
  try {
    const updateData = reqBody.title ? {
      ...reqBody,
      slug: generateSlug(reqBody.title)
    } : { ...reqBody }
    const SELECT_USER_FIELDS = '_id firstName lastName'

    const blog = await blogModel
      .findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      )
      .populate({
        path: 'likes',
        select: SELECT_USER_FIELDS
      })
      .populate({
        path: 'dislikes',
        select: SELECT_USER_FIELDS
      })
    if (!blog) throw new ApiError(StatusCodes.NOT_FOUND, 'Blog not found')
    return blog
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Update blog failed')
  }
}

const deleteBlog = async (id) => {
  try {
    const blog = await blogModel.findByIdAndDelete(id)
    if (!blog) throw new ApiError(StatusCodes.NOT_FOUND, 'Blog not found')
    return blog
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Delete blog failed')
  }
}

const like = async (blogId, userId) => {
  /*
    - check user dislike?
      - dislike => pull dislike, push like
      - no dislike =>> check user like?
        - like => pull like
        - no like => push like
  */
  try {
    const foundBlog = await blogModel.findById(blogId)
    if (!foundBlog) throw new ApiError(StatusCodes.NOT_FOUND, 'Blog not found')

    const isDislike = foundBlog.dislikes?.some(dislikeUserId => dislikeUserId.equals(userId))
    if (isDislike) {
      return await blogModel.findByIdAndUpdate(
        blogId,
        { $pull: { dislikes: userId }, $push: { likes: userId } },
        { new: true }
      )
    }

    const isLike = foundBlog.likes?.some(likeUserId => likeUserId.equals(userId))
    if (isLike) {
      return await blogModel.findByIdAndUpdate(
        blogId,
        { $pull: { likes: userId } },
        { new: true }
      )
    }
    return await blogModel.findByIdAndUpdate(
      blogId,
      { $push: { likes: userId } },
      { new: true }
    )
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Update like blog failed')
  }
}

const dislike = async (blogId, userId) => {
  /*
    - check user like?
      - like => pull like, pull dislike
      - no like => check user dislike?
        - dislike => pull dislike
        - no dislike => push dislike
  */
  try {
    const foundBlog = await blogModel.findById(blogId)
    if (!foundBlog) throw new ApiError(StatusCodes.NOT_FOUND, 'Blog not found')

    const isLike = foundBlog.likes?.some(likeUserId => likeUserId.equals(userId))
    if (isLike) {
      return await blogModel.findByIdAndUpdate(
        blogId,
        { $pull: { likes: userId }, $push: { dislikes: userId } },
        { new: true }
      )
    }

    const isDislike = foundBlog.dislikes?.some(dislikeUserId => dislikeUserId.equals(userId))
    if (isDislike) {
      return await blogModel.findByIdAndUpdate(
        blogId,
        { $pull: { dislikes: userId } },
        { new: true }
      )
    }
    return await blogModel.findByIdAndUpdate(
      blogId,
      { $push: { dislikes: userId } },
      { new: true }
    )
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Update dislike blog failed')
  }
}

export default {
  createNew,
  getBlog,
  getBlogs,
  updateBlog,
  deleteBlog,
  like,
  dislike
}
