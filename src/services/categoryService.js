import { StatusCodes } from 'http-status-codes'
import categoryModel from '~/models/categoryModel'
import ApiError from '~/utils/ApiError'
import { parseQueryParams } from '~/utils/formatter'
import { calculateTotalPages } from '~/utils/util'

const createNew = async (reqBody) => {
  try {
    return await categoryModel.create(reqBody)
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Create category failed'
    )
  }
}

const getCategory = async (id, reqQuery) => {
  try {
    const { fields } = parseQueryParams(reqQuery)
    const category = await categoryModel
      .findById(id)
      .select(fields)
    if (!category)
      throw new ApiError(StatusCodes.NOT_FOUND, 'Category not found')
    return category
  } catch (error) {
    if (error.name === ApiError.name) throw error
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Get category failed')
  }
}

const getCategoryBySlug = async (slug, reqQuery) => {
  try {
    const { fields } = parseQueryParams(reqQuery)
    const category = await categoryModel
      .findOne({
        slug
      })
      .select(fields)
    if (!category)
      throw new ApiError(StatusCodes.NOT_FOUND, 'Category not found')
    return category
  } catch (error) {
    if (error.name === ApiError.name) throw error
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Get category failed')
  }
}

const getCategories = async (reqQuery) => {
  try {
    const { query, sort, fields, skip, limit, page } =
      parseQueryParams(reqQuery)
    const [categories, totalCategories] = await Promise.all([
      categoryModel
        .find(query)
        .sort(sort)
        .select(fields)
        .skip(skip)
        .limit(limit),
      categoryModel.countDocuments()
    ])
    return {
      page,
      totalPages: calculateTotalPages(totalCategories, limit),
      totalCategories,
      categories
    }
  } catch (error) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Get categories failed'
    )
  }
}

const updateCategory = async (id, reqBody) => {
  try {
    const category = await categoryModel.findByIdAndUpdate(id, reqBody, {
      new: true
    })
    if (!category)
      throw new ApiError(StatusCodes.NOT_FOUND, 'Category not found')
    return category
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Update category failed'
    )
  }
}

const deleteCategory = async (id) => {
  try {
    const category = await categoryModel.findByIdAndDelete(id)
    if (!category)
      throw new ApiError(StatusCodes.NOT_FOUND, 'Category not found')
    return category
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Update category failed'
    )
  }
}

export default {
  createNew,
  getCategory,
  getCategoryBySlug,
  getCategories,
  updateCategory,
  deleteCategory
}
