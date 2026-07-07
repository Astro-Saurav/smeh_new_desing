const express = require('express')
const { register, login, refresh, logout, me, changePassword } = require('../controllers/authController')
const { validateRequest } = require('../middleware/validateRequest')
const { loginSchema, registerSchema } = require('../validators/authSchemas')
const { authenticate, authorize } = require('../middleware/authMiddleware')

const authRouter = express.Router()

authRouter.post('/login', validateRequest(loginSchema), login)
authRouter.post('/refresh', refresh)
authRouter.post('/logout', logout)
authRouter.get('/me', authenticate, me)
authRouter.post('/register', authenticate, authorize('admin'), validateRequest(registerSchema), register)
authRouter.post('/change-password', authenticate, changePassword)

module.exports = {
  authRouter
}
