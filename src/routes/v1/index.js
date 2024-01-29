import express from 'express'
import authRoute from './authRoute'
import userRoute from './userRoute'
import productRoute from './productRoute'

const router = express.Router()

router.use('/auth', authRoute)
router.use('/users', userRoute)
router.use('/products', productRoute)

export default router
