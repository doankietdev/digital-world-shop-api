import express from 'express'
import loginSessionController from '~/controllers/loginSessionController'
import authMiddleware from '~/middlewares/authMiddleware'

const router = express.Router()

router.use(authMiddleware.authenticate)

router.route('/get-for-current').get(loginSessionController.getForCurrentUser)
router.route('/logout-session-for-current').post(loginSessionController.logoutSessionForCurrentUser)
router.route('/logout-all-sessions-for-current').post(loginSessionController.logoutAllSessionsForCurrentUser)

export default router
