import { StatusCodes } from 'http-status-codes'
import brandModel from '~/models/brandModel'
import ApiError from '~/utils/ApiError'
import { parseQueryParams } from '~/utils/formatter'
import { calculateTotalPages } from '~/utils/util'

const createNew = async (reqBody) => {
  try {
    return await brandModel.create(reqBody)
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Create brand failed')
  }
}

const getBrand = async (id, reqQuery) => {
  try {
    const { fields } = parseQueryParams(reqQuery)
    const brand = await brandModel.findById(id).select(fields)
    if (!brand) throw new ApiError(StatusCodes.NOT_FOUND, 'Brand not found')
    return brand
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Get brand failed')
  }
}

const getBrands = async (reqQuery) => {
  try {
    const { query, sort, fields, skip, limit, page } = parseQueryParams(reqQuery)
    const [brands, totalBrands] = await Promise.all([
      brandModel
        .find(query)
        .sort(sort)
        .select(fields)
        .skip(skip)
        .limit(limit),
      brandModel.countDocuments()
    ])
    return {
      page,
      totalPages: calculateTotalPages(totalBrands, limit),
      totalBrands,
      brands
    }
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Get brands failed')
  }
}

const updateBrand = async (id, reqBody) => {
  try {
    const brand = await brandModel.findByIdAndUpdate(
      id,
      reqBody,
      { new: true }
    )
    if (!brand) throw new ApiError(StatusCodes.NOT_FOUND, 'Brand not found')
    return brand
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Update brand failed')
  }
}

const deleteBrand = async (id) => {
  try {
    const brand = await brandModel.findByIdAndDelete(id)
    if (!brand) throw new ApiError(StatusCodes.NOT_FOUND, 'Brand not found')
    return brand
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Update brand failed')
  }
}

export default {
  createNew,
  getBrand,
  getBrands,
  updateBrand,
  deleteBrand
}
