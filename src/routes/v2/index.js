import express from 'express'
import productRoute from './productRoute'
import checkoutRoute from './checkoutRoute'

const router = express.Router()

router.use('/products', productRoute)
router.use('/checkout', checkoutRoute)

export default router
