import { StatusCodes } from 'http-status-codes'
import paymentMethodModel from '~/models/paymentMethodModel'
import ApiError from '~/utils/ApiError'
import { parseQueryParams } from '~/utils/formatter'
import { calculateTotalPages } from '~/utils/util'

const getPaymentMethods = async (reqQuery) => {
  try {
    const { query, sort, fields, skip, limit, page } =
      parseQueryParams(reqQuery)
    const [paymentMethods, totalPaymentMethods] = await Promise.all([
      paymentMethodModel
        .find(query)
        .sort(sort)
        .select(fields)
        .skip(skip)
        .limit(limit),
      paymentMethodModel.countDocuments()
    ])
    return {
      page,
      totalPages: calculateTotalPages(totalPaymentMethods, limit),
      totalItems: totalPaymentMethods,
      items: paymentMethods
    }
  } catch (error) {
    if (error.name === ApiError.name) throw error
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Get payment methods failed')
  }
}

const getPaymentMethod = async (id, reqQuery) => {
  try {
    const { fields } = parseQueryParams(reqQuery)
    const paymentMethod = await paymentMethodModel.findById(id).select(fields)
    if (!paymentMethod) throw new ApiError(StatusCodes.NOT_FOUND, 'Payment method not found')
    return paymentMethod
  } catch (error) {
    if (error.name === ApiError.name) throw error
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Get payment method failed')
  }
}


export default {
  getPaymentMethods,
  getPaymentMethod
}
