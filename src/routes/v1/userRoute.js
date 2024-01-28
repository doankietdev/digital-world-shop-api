import express from 'express'
import userController from '~/controllers/userController'
import authMiddleware from '~/middlewares/authMiddleware'
import { ROLES } from '~/utils/constants'

const router = express.Router()

router.use(authMiddleware.authenticate)

router.route('/get-current').get(userController.getCurrent)
router.route('/update-current').patch(userController.updateCurrent)
router.route('/set-blocked/:id')
  .patch(authMiddleware.checkPermission(ROLES.ADMIN), userController.setBlocked)
router.route('/:id')
  .patch(authMiddleware.checkPermission(ROLES.ADMIN), userController.updateUser)
  .delete(authMiddleware.checkPermission(ROLES.ADMIN), userController.deleteUser)
router.route('/').get(authMiddleware.checkPermission(ROLES.ADMIN), userController.getAll)

export default router
