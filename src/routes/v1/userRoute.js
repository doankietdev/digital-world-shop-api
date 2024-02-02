import express from 'express'
import userController from '~/controllers/userController'
import authMiddleware from '~/middlewares/authMiddleware'
import { ROLES } from '~/utils/constants'
import uploadMiddleware from '~/middlewares/uploadMiddleware'
import userValidation from '~/validations/userValidation'

const router = express.Router()

router.use(authMiddleware.authenticate)

router.route('/get-current')
  .get(userController.getCurrentUser)

router.route('/update-current')
  .patch(
    uploadMiddleware.single('image'),
    userValidation.updateCurrentUser,
    userController.updateCurrentUser
  )

router.route('/set-blocked/:id')
  .patch(
    authMiddleware.checkPermission(ROLES.ADMIN),
    userValidation.setBlocked,
    userController.setBlocked
  )

router.route('/add-product-to-cart')
  .patch(
    userController.addProductToCart
  )

router.route('/reduce-product-from-cart')
  .patch(
    userController.reduceProductFromCart
  )

router.route('/delete-product-from-cart')
  .patch(
    userController.deleteProductFromCart
  )

router.route('/:id')
  .get(
    authMiddleware.checkPermission(ROLES.ADMIN),
    userValidation.getUser,
    userController.getUser
  )
  .patch(
    authMiddleware.checkPermission(ROLES.ADMIN),
    uploadMiddleware.single('image'),
    userValidation.updateUser,
    userController.updateUser
  )
  .delete(
    authMiddleware.checkPermission(ROLES.ADMIN),
    userValidation.deleteUser,
    userController.deleteUser
  )

router.route('/').get(authMiddleware.checkPermission(ROLES.ADMIN), userController.getUsers)

export default router
