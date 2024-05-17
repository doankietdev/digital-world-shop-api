import express from 'express'
import authRoute from './authRoute'
import userRoute from './userRoute'
import cartRoute from './cartRoute'
import brandRoute from './brandRoute'
import productRoute from './productRoute'
import categoryRoute from './categoryRoute'
import discountRoute from './discountRoute'
import addressRoute from './addressRoute'
import checkoutRoute from './checkoutRoute'
import orderRoute from './orderRoute'

const router = express.Router()

router.use('/auth', authRoute)
router.use('/users', userRoute)
router.use('/carts', cartRoute)
router.use('/brands', brandRoute)
router.use('/products', productRoute)
router.use('/categories', categoryRoute)
router.use('/discounts', discountRoute)
router.use('/addresses', addressRoute)
router.use('/checkout', checkoutRoute)
router.use('/orders', orderRoute)

export default router
