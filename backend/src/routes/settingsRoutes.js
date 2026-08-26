const express = require('express')
const { getSettings, updateSettings } = require('../controllers/settingsController')
const { authenticate, authorize } = require('../middleware/authMiddleware')

const settingsRouter = express.Router()

// Public route: site settings (social links, breaking ticker, branding info) can be viewed by any visitor
settingsRouter.get('/', getSettings)
settingsRouter.put('/', authenticate, authorize('admin'), updateSettings)

module.exports = {
  settingsRouter
}
