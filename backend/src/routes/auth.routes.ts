import { Router } from 'express'
import { getMe, login, logout, refreshAccessToken, register } from '../controllers/auth.controller'
import { protect } from '../middleware/auth.middleware'
import { validateLogin, validateRegister } from '../validators/auth.validator'

const router = Router()

router.post('/register', validateRegister, register)
router.post('/login', validateLogin, login)
router.post('/refresh', refreshAccessToken)
router.post('/logout', logout)
router.get('/me', protect, getMe)

export default router
