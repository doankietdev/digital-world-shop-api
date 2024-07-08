import express from 'express'
import userController from '~/controllers/userController'
import authMiddleware from '~/middlewares/authMiddleware'
import imageUploadMiddleware from '~/middlewares/imageUploadMiddleware'
import { ROLES } from '~/utils/constants'
import userValidation from '~/validations/userValidation'

const router = express.Router()

router.use(authMiddleware.authenticate)

router.route('/get-current').get(userController.getCurrentUser)

router
  .route('/set-default-address')
  .post(userValidation.setDefaultAddress, userController.setDefaultAddress)

router
  .route('/update-current')
  .patch(
    userValidation.updateCurrentUser,
    userController.updateCurrentUser
  )

router
  .route('/upload-avatar-for-current')
  .patch(
    imageUploadMiddleware({ maxFileNumber: 1 }),
    userValidation.uploadAvatarForCurrentUser,
    userController.uploadAvatarForCurrentUser
  )

router
  .route('/change-password')
  .patch(
    userValidation.changePassword,
    userController.changePassword
  )

router
  .route('/set-blocked/:id')
  .patch(
    authMiddleware.checkPermission(ROLES.ADMIN),
    userValidation.setBlocked,
    userController.setBlocked
  )

router
  .route('/:id')
  .get(
    authMiddleware.checkPermission(ROLES.ADMIN),
    userValidation.getUser,
    userController.getUser
  )
  .delete(
    authMiddleware.checkPermission(ROLES.ADMIN),
    userValidation.deleteUser,
    userController.deleteUser
  )

router
  .route('/')
  .get(authMiddleware.checkPermission(ROLES.ADMIN), userController.getUsers)

export default router
