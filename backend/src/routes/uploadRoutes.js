const express = require('express')
const { upload } = require('../controllers/uploadController')
const { authenticate, authorize } = require('../middleware/authMiddleware')

const uploadRouter = express.Router()

// Secure multipart media upload pipeline using multer
uploadRouter.post('/', authenticate, authorize('admin', 'editor'), upload)

module.exports = { uploadRouter }
