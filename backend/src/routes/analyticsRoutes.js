const express = require('express')
const { overview } = require('../controllers/analyticsController')
const { authenticate, authorize } = require('../middleware/authMiddleware')

const analyticsRouter = express.Router()

analyticsRouter.get('/overview', authenticate, authorize('admin', 'editor'), overview)

module.exports = {
  analyticsRouter
}
