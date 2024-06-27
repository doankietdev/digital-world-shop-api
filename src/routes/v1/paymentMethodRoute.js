import express from 'express'
import paymentMethodController from '~/controllers/paymentMethodController'
import authMiddleware from '~/middlewares/authMiddleware'

const router = express.Router()

router.use(authMiddleware.authenticate)

router.route('/').get(paymentMethodController.getPaymentMethods)
router.route('/:id').get(paymentMethodController.getPaymentMethod)

export default router
