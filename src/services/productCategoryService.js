import { StatusCodes } from 'http-status-codes'
import productCategoryModel from '~/models/productCategoryModel'
import ApiError from '~/utils/ApiError'
import { parseQueryParams } from '~/utils/formatter'
import { calculateTotalPages } from '~/utils/util'

const createNew = async (reqBody) => {
  try {
    return await productCategoryModel.create(reqBody)
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Create product category failed')
  }
}

const getCategory = async (id, reqQuery) => {
  try {
    const { fields } = parseQueryParams(reqQuery)
    const category = await productCategoryModel.findById(id).select(fields)
    if (!category) throw new ApiError(StatusCodes.NOT_FOUND, 'Product category not found')
    return category
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Get product failed')
  }
}

const getCategories = async (reqQuery) => {
  try {
    const { query, sort, fields, skip, limit, page } = parseQueryParams(reqQuery)
    const [categories, totalCategories] = await Promise.all([
      productCategoryModel
        .find(query)
        .sort(sort)
        .select(fields)
        .skip(skip)
        .limit(limit),
      productCategoryModel.countDocuments()
    ])
    return {
      page,
      totalPages: calculateTotalPages(totalCategories, limit),
      totalCategories,
      categories
    }
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Get product categories failed')
  }
}

const updateCategory = async (id, reqBody) => {
  try {
    const category = await productCategoryModel.findByIdAndUpdate(
      id,
      reqBody,
      { new: true }
    )
    if (!category) throw new ApiError(StatusCodes.NOT_FOUND, 'Product category not found')
    return category
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Update product category failed')
  }
}

const deleteCategory = async (id) => {
  try {
    const category = await productCategoryModel.findByIdAndDelete(id)
    if (!category) throw new ApiError(StatusCodes.NOT_FOUND, 'Product category not found')
    return category
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Update product category failed')
  }
}

export default {
  createNew,
  getCategory,
  getCategories,
  updateCategory,
  deleteCategory
}