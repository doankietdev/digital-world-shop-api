import paymentMethodService from '~/services/paymentMethodService'
import SuccessResponse from '~/utils/SuccessResponse'
import asyncHandler from '~/utils/asyncHandler'

const getPaymentMethods = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Get payment methods successfully',
    metadata: await paymentMethodService.getPaymentMethods(req.query)
  }).send(res)
})

const getPaymentMethod = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Get payment method successfully',
    metadata: await paymentMethodService.getPaymentMethod(
      req.params.id,
      req.query
    )
  }).send(res)
})

export default {
  getPaymentMethods,
  getPaymentMethod
}
