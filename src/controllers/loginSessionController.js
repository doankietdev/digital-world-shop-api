import loginSessionService from '~/services/loginSessionService'
import SuccessResponse from '~/utils/SuccessResponse'
import asyncHandler from '~/utils/asyncHandler'

const getForCurrentUser = asyncHandler(async (req, res) => {
  new SuccessResponse({
    message: 'Get login sessions successfully',
    metadata: {
      loginSessions: await loginSessionService.getByUserId(req.user._id, req.loginSession?.clientId)
    }
  }).send(res)
})

const logoutSessionForCurrentUser = asyncHandler(async (req, res) => {
  await loginSessionService.logoutSessionForCurrentUser({
    currentLoginSessionId: req.loginSession?._id,
    loginSessionId: req.body.loginSessionId,
    userId: req.user._id
  })
  new SuccessResponse({
    message: 'Logout login session successfully'
  }).send(res)
})

const logoutAllSessionsForCurrentUser = asyncHandler(async (req, res) => {
  await loginSessionService.logoutAllSessionsForCurrentUser({
    currentLoginSessionId: req.loginSession?._id,
    userId: req.user._id
  })
  new SuccessResponse({
    message: 'Logout all login sessions successfully'
  }).send(res)
})

export default {
  getForCurrentUser,
  logoutSessionForCurrentUser,
  logoutAllSessionsForCurrentUser
}
