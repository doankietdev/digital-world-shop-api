import express from 'express'
import productRoute from './productRoute'
import checkoutRoute from './checkoutRoute'
import cartRoute from './cartRoute'

const router = express.Router()

router.use('/products', productRoute)
router.use('/checkout', checkoutRoute)
router.use('/carts', cartRoute)

export default router
