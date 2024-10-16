import { StatusCodes } from 'http-status-codes'
import checkoutService from '~/services/checkoutService'
import SuccessResponse from '~/utils/SuccessResponse'
import asyncHandler from '~/utils/asyncHandler'

const review = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Get order review successfully',
    metadata: {
      ...(await checkoutService.review(req.user?._id, req.body))
    }
  }).send(res)
})

const order = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Order successfully',
    metadata: {
      ...(await checkoutService.order(req.user?._id, req.body))
    }
  }).send(res)
})

const cancelOrder = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Cancel order successfully',
    metadata: {
      order: await checkoutService.cancelOrder(
        req.user?._id,
        req.query.orderId
      )
    }
  }).send(res)
})

const createPayPalOrder = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Create PayPal order successfully',
    metadata: await checkoutService.createPayPalOrder(req.user?._id, req.body)
  }).send(res)
})

const capturePayPalOrder = asyncHandler(async (req, res) => {
  const { paypalOrderId, orderProducts } = req.body
  new SuccessResponse({
    message: 'Capture PayPal order successfully',
    metadata: await checkoutService.capturePayPalOrder({
      userId: req.user?._id,
      paypalOrderId,
      orderProducts
    })
  }).send(res)
})

const initMomoPayment = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Init Momo payment successfully',
    metadata: await checkoutService.initMomoPayment(req.user?._id, req.body)
  }).send(res)
})

const callbackMomo = asyncHandler(async (req, res) => {
  await checkoutService.callbackMomo(req.body)

  new SuccessResponse({
    statusCode: StatusCodes.NO_CONTENT,
    message: 'Momo callback successfully'
  }).send(res)
})

export default {
  review,
  order,
  createPayPalOrder,
  capturePayPalOrder,
  initMomoPayment,
  callbackMomo,
  cancelOrder
}
