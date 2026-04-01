const express = require('express')
const { list, remove } = require('../controllers/userController')
const { authenticate, authorize } = require('../middleware/authMiddleware')
const { validateRequest } = require('../middleware/validateRequest')
const { idParamSchema } = require('../validators/userSchemas')

const userRouter = express.Router()

userRouter.get('/', authenticate, authorize('admin'), list)
userRouter.delete('/:id', authenticate, authorize('admin'), validateRequest(idParamSchema), remove)

module.exports = {
  userRouter
}
