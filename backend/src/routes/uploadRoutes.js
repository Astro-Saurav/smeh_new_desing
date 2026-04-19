const express = require('express')
const multer = require('multer')
const { uploadImage } = require('../controllers/uploadController')
const { authenticate, authorize } = require('../middleware/authMiddleware')

// Setup Multer to store the file in memory (buffer) instead of disk
// Add limit to 5MB
const storage = multer.memoryStorage()
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    // Basic validation to only accept known image mime types
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed!'), false)
    }
  }
})

const uploadRouter = express.Router()

// We use upload.single('image') exactly. No JSON validation schema needed for formData.
uploadRouter.post('/', authenticate, authorize('admin', 'editor'), upload.single('image'), uploadImage)

module.exports = {
  uploadRouter
}