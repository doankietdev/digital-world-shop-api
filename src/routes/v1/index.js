import express from 'express'
import authRoute from './authRoute'
import userRoute from './userRoute'

const router = express.Router()

router.use('/auth', authRoute)
router.use('/users', userRoute)

export default router
