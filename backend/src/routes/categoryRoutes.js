const express = require('express')
const { create, list } = require('../controllers/categoryController')
const { authenticate, authorize } = require('../middleware/authMiddleware')
const { validateRequest } = require('../middleware/validateRequest')
const { createCategorySchema } = require('../validators/categorySchemas')

const categoryRouter = express.Router()

categoryRouter.get('/', authenticate, list)
categoryRouter.post('/', authenticate, authorize('admin', 'editor'), validateRequest(createCategorySchema), create)

module.exports = {
  categoryRouter
}
