import loginSessionService from '~/services/loginSessionService'
import SuccessResponse from '~/utils/SuccessResponse'
import asyncHandler from '~/utils/asyncHandler'

const getForCurrentUser = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Get login sessions successfully',
    metadata: {
      loginSessions: await loginSessionService.getByUserId(req.user._id)
    }
  }).send(res)
})

const logoutSessionForCurrentUser = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Logout login session successfully',
    metadata: {
      loginSessions: await loginSessionService.logoutSessionForCurrentUser({
        loginSessionId: req.body.loginSessionId,
        userId: req.user._id
      })
    }
  }).send(res)
})

export default {
  getForCurrentUser,
  logoutSessionForCurrentUser
}
