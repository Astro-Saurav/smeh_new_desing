const express = require('express')
const { getSettings, updateSettings } = require('../controllers/settingsController')
const { authenticate, authorize } = require('../middleware/authMiddleware')

const settingsRouter = express.Router()

// Settings can be viewed by any authenticated user (e.g. editor) but only updated by admin
settingsRouter.get('/', authenticate, getSettings)
settingsRouter.put('/', authenticate, authorize('admin'), updateSettings)

module.exports = {
  settingsRouter
}
