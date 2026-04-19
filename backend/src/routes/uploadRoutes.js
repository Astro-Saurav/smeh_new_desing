const express = require('express')
const { uploadImage } = require('../controllers/uploadController')
const { authenticate, authorize } = require('../middleware/authMiddleware')

const uploadRouter = express.Router()

// JSON body upload — compatible with Vercel serverless (no Multer needed)
uploadRouter.post('/', authenticate, authorize('admin', 'editor'), uploadImage)

module.exports = { uploadRouter }