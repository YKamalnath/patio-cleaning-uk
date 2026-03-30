import { Router } from 'express'
import authRoutes from './auth.routes.js'
import adminRoutes from './admin.routes.js'
import customerRoutes from './customer.routes.js'
import publicRoutes from './public.routes.js'

const router = Router()

router.use('/auth', authRoutes)
router.use('/public', publicRoutes)
router.use('/customer', customerRoutes)
router.use('/admin', adminRoutes)

export default router
