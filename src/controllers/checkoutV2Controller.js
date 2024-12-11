import checkoutV2Service from '~/services/checkoutV2Service'
import SuccessResponse from '~/utils/SuccessResponse'
import asyncHandler from '~/utils/asyncHandler'

const review = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Get order review successfully',
    metadata: await checkoutV2Service.review(req.user?._id, req.body, req.query._currency)
  }).send(res)
})

export default {
  review
}
