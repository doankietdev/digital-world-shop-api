import express from 'express'
import authRoute from './authRoute'
import userRoute from './userRoute'
import productRoute from './productRoute'
import productCategoryRoute from './productCategoryRoute'
import blogRoute from './blogRoute'
import discountRoute from './discountRoute'

const router = express.Router()

router.use('/auth', authRoute)
router.use('/users', userRoute)
router.use('/products', productRoute)
router.use('/product-categories', productCategoryRoute)
router.use('/blogs', blogRoute)
router.use('/discounts', discountRoute)

export default router
