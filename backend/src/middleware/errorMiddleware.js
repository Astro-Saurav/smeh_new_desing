const { env } = require('../config/env')
const logger = require('../utils/logger')

function notFoundHandler (req, res) {
  res.status(404).json({ message: 'Route not found' })
}

function errorHandler (error, req, res, next) {
  // Always log the full error internally (never suppress it in logs)
  logger.error('Unhandled error', {
    message: error.message,
    stack: error.stack,
    requestId: req.requestId,
    url: req.originalUrl,
    method: req.method
  })

  if (res.headersSent) {
    return next(error)
  }

  const statusCode = error.statusCode || error.status || 500

  // In production: never leak stack traces or internal error messages
  if (env.nodeEnv === 'production' && statusCode === 500) {
    return res.status(500).json({
      message: 'An internal server error occurred. Please try again later.'
    })
  }

  // For 4xx errors (validation, auth, not found) it's safe to show the message
  return res.status(statusCode).json({
    message: error.message || 'Internal server error'
  })
}

module.exports = {
  notFoundHandler,
  errorHandler
}
