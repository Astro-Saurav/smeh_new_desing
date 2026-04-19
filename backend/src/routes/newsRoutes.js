const express = require('express')
const {
  create,
  list,
  getById,
  update,
  remove
} = require('../controllers/newsController')
const { authenticate, authorize } = require('../middleware/authMiddleware')
const { validateRequest } = require('../middleware/validateRequest')
const {
  createNewsSchema,
  updateNewsSchema,
  idParamSchema,
  listNewsSchema
} = require('../validators/newsSchemas')

const newsRouter = express.Router()

newsRouter.get('/', validateRequest(listNewsSchema), list)
newsRouter.get('/:id', validateRequest(idParamSchema), getById)
newsRouter.post('/', authenticate, authorize('admin', 'editor'), validateRequest(createNewsSchema), create)
newsRouter.put('/:id', authenticate, authorize('admin', 'editor'), validateRequest(updateNewsSchema), update)
newsRouter.delete('/:id', authenticate, authorize('admin'), validateRequest(idParamSchema), remove)

module.exports = {
  newsRouter
}
