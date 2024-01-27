import SuccessResponse from '~/utils/SuccessResponse'
import asyncHandler from '~/utils/asyncHandler'
import userService from '~/services/userService'

const getCurrent = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Get current user successfully',
    metadata: {
      user: await userService.getCurrent(req.decodedUser?.userId)
    }
  }).send(res)
})

export default {
  getCurrent
}
