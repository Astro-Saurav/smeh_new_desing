const express = require('express')
const { create, list, remove } = require('../controllers/categoryController')
const { authenticate, authorize } = require('../middleware/authMiddleware')
const { validateRequest } = require('../middleware/validateRequest')
const { createCategorySchema, idParamSchema } = require('../validators/categorySchemas')

const categoryRouter = express.Router()

categoryRouter.get('/', authenticate, list)
categoryRouter.post('/', authenticate, authorize('admin', 'editor'), validateRequest(createCategorySchema), create)
categoryRouter.delete('/:id', authenticate, authorize('admin'), validateRequest(idParamSchema), remove)

module.exports = {
  categoryRouter
}
