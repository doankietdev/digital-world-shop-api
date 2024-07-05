import express from 'express'
import orderController from '~/controllers/orderController'
import authMiddleware from '~/middlewares/authMiddleware'
import { ROLES } from '~/utils/constants'

const router = express.Router()

router.use(authMiddleware.authenticate)

router
  .route('/:orderId/get-order-of-current-user')
  .get(orderController.getOrderOfCurrentUser)

router
  .route('/get-orders-of-current-user')
  .get(orderController.getOrdersOfCurrentUser)

router
  .route('/:orderId/update-status')
  .patch(
    authMiddleware.checkPermission(ROLES.ADMIN),
    orderController.updateStatus
  )

router
  .route('/:orderId/update-shipping-address-of-current-user')
  .patch(
    orderController.updateShippingAddressOfCurrentUser
  )

router
  .route('/:orderId')
  .delete(
    authMiddleware.checkPermission(ROLES.ADMIN),
    orderController.deleteOrder
  )

export default router
