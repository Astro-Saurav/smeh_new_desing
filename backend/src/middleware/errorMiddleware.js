function notFoundHandler (req, res) {
  res.status(404).json({ message: 'Route not found' })
}

function errorHandler (error, req, res, next) {
  console.error(error)

  if (res.headersSent) {
    return next(error)
  }

  const statusCode = error.statusCode || 500
  return res.status(statusCode).json({
    message: error.message || 'Internal server error'
  })
}

module.exports = {
  notFoundHandler,
  errorHandler
}
