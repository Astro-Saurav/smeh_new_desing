const express = require('express')
const {
  create,
  list,
  getById,
  getBySlug,
  update,
  remove
} = require('../controllers/newsController')
const { authenticate, authorize, optionalAuthenticate } = require('../middleware/authMiddleware')
const { validateRequest } = require('../middleware/validateRequest')
const {
  createNewsSchema,
  updateNewsSchema,
  idParamSchema,
  listNewsSchema,
  slugParamSchema
} = require('../validators/newsSchemas')

const newsRouter = express.Router()

newsRouter.get('/', validateRequest(listNewsSchema), list)
newsRouter.get('/slug/:slug', optionalAuthenticate, validateRequest(slugParamSchema), getBySlug)
newsRouter.get('/:id', optionalAuthenticate, validateRequest(idParamSchema), getById)
newsRouter.post('/', authenticate, authorize('admin', 'editor'), validateRequest(createNewsSchema), create)
newsRouter.put('/:id', authenticate, authorize('admin', 'editor'), validateRequest(updateNewsSchema), update)
newsRouter.delete('/:id', authenticate, authorize('admin'), validateRequest(idParamSchema), remove)

module.exports = {
  newsRouter
}
