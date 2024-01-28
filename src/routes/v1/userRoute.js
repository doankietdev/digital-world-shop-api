import express from 'express'
import userController from '~/controllers/userController'
import authMiddleware from '~/middlewares/authMiddleware'
import { ROLES } from '~/utils/constants'

const router = express.Router()

router.use(authMiddleware.authenticate)

router.route('/get-current').get(userController.getCurrent)
router.route('/').get(authMiddleware.checkPermission(ROLES.ADMIN), userController.getAll)
router.route('/update-current').patch(userController.updateCurrent)
router.route('/:id')
  .patch(authMiddleware.checkPermission(ROLES.ADMIN), userController.updateUser)
  .delete(authMiddleware.checkPermission(ROLES.ADMIN), userController.deleteUser)

export default router
