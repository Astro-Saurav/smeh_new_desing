const express = require('express')
const { uploadImage } = require('../controllers/uploadController')
const { authenticate, authorize } = require('../middleware/authMiddleware')
const { validateRequest } = require('../middleware/validateRequest')
const { uploadSchema } = require('../validators/uploadSchemas')

const uploadRouter = express.Router()

uploadRouter.post('/', authenticate, authorize('admin', 'editor'), validateRequest(uploadSchema), uploadImage)

module.exports = {
  uploadRouter
}
