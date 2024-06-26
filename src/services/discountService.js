import { StatusCodes } from 'http-status-codes'
import discountModel from '~/models/discountModel'
import ApiError from '~/utils/ApiError'
import { parseQueryParams } from '~/utils/formatter'
import { calculateTotalPages } from '~/utils/util'

const createNew = async (reqBody) => {
  try {
    return await discountModel.create(reqBody)
  } catch (error) {
    if (error.name === ApiError.name) throw error
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Create new discount failed'
    )
  }
}

const getDiscount = async (id, reqQuery) => {
  try {
    const { fields } = parseQueryParams(reqQuery)
    const discount = (
      await discountModel
        .findById(id)
        .select(fields)
        .populate({
          path: 'products',
          populate: {
            path: 'discounts',
            select: '-createdAt -updatedAt'
          }
        })
        .populate({
          path: 'products',
          populate: {
            path: 'category',
            select: '-createdAt -updatedAt'
          }
        })
    ).toObject()
    if (!discount)
      throw new ApiError(StatusCodes.NOT_FOUND, 'Discount not found')
    discount.products?.forEach((product) => delete product?.discounts)
    return discount
  } catch (error) {
    if (error.name === ApiError.name) throw error
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Get discount failed')
  }
}

const getDiscountByCodePublic = async (code, reqQuery) => {
  try {
    const { fields } = parseQueryParams(reqQuery)
    const defaultFields = [
      '_id',
      'code',
      'name',
      'type',
      'value',
      'expireAt',
      'applyFor',
      'products'
    ]
    const discount = (
      await discountModel
        .findOne({ code })
        .select(fields)
        .populate({
          path: 'products',
          select: '_id title slug brand price quantity thumb sold',
          populate: {
            path: 'category',
            select: '-createdAt -updatedAt'
          }
        })
    )?.toObject()

    if (!discount)
      throw new ApiError(StatusCodes.NOT_FOUND, 'Discount not found')

    const IS_EXPIRED = Date.now() >= new Date(discount.expireAt).getTime()
    if (IS_EXPIRED)
      throw new ApiError(StatusCodes.GONE, 'Discount code has expired')

    discount.products?.forEach((product) => delete product?.discounts)
    return defaultFields.reduce(
      (resDiscount, field) => ({ ...resDiscount, [field]: discount[field] }),
      {}
    )
  } catch (error) {
    if (error.name === ApiError.name) throw error
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Get discount by code failed'
    )
  }
}

const getDiscountsPublic = async (reqQuery) => {
  try {
    const { query, sort, fields, skip, limit, page } =
      parseQueryParams(reqQuery)
    const defaultFields = [
      '_id',
      'code',
      'name',
      'type',
      'value',
      'expireAt',
      'applyFor'
    ]
    const [discounts, totalDiscounts] = await Promise.all([
      discountModel
        .find(query)
        .sort(sort)
        .select(fields)
        .skip(skip)
        .limit(limit),
      discountModel.countDocuments()
    ])
    return {
      page,
      totalPages: calculateTotalPages(totalDiscounts, limit),
      totalDiscounts,
      discounts: discounts.map((discount) =>
        defaultFields.reduce(
          (resDiscount, field) => ({
            ...resDiscount,
            [field]: discount[field]
          }),
          {}
        )
      )
    }
  } catch (error) {
    if (error.name === ApiError.name) throw error
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Get discount by code failed'
    )
  }
}

const getDiscounts = async (reqQuery) => {
  try {
    const defaultFields = [
      '_id',
      'code',
      'name',
      'type',
      'value',
      'expireAt',
      'applyFor'
    ]
    const { query, sort, fields, skip, limit, page } =
      parseQueryParams(reqQuery)
    const [discounts, totalDiscounts] = await Promise.all([
      discountModel
        .find(query)
        .sort(sort)
        .select(fields)
        .skip(skip)
        .limit(limit),
      discountModel.countDocuments()
    ])
    return {
      page,
      totalPages: calculateTotalPages(totalDiscounts, limit),
      totalDiscounts,
      discounts: discounts.map((discount) =>
        defaultFields.reduce(
          (resDiscount, field) => ({
            ...resDiscount,
            [field]: discount[field]
          }),
          {}
        )
      )
    }
  } catch (error) {
    if (error.name === ApiError.name) throw error
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Get discount failed')
  }
}

const updateDiscount = async (id, reqBody) => {
  try {
    const discount = await discountModel.findByIdAndUpdate(id, reqBody, {
      new: true
    })
    if (!discount)
      throw new ApiError(StatusCodes.NOT_FOUND, 'Discount not found')
    return discount
  } catch (error) {
    if (error.name === ApiError.name) throw error
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Update discount failed'
    )
  }
}

const deleteDiscount = async (id) => {
  try {
    const discount = await discountModel.findByIdAndDelete(id)
    if (!discount)
      throw new ApiError(StatusCodes.NOT_FOUND, 'Discount not found')
    return discount
  } catch (error) {
    if (error.name === ApiError.name) throw error
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Update discount failed'
    )
  }
}

export default {
  createNew,
  getDiscount,
  getDiscountByCodePublic,
  getDiscounts,
  getDiscountsPublic,
  updateDiscount,
  deleteDiscount
}
