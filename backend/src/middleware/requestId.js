const crypto = require('crypto')

function requestId (req, res, next) {
  // Inject or retrieve correlation ID
  const reqId = req.headers['x-request-id'] || crypto.randomUUID()
  req.requestId = reqId
  res.setHeader('x-request-id', reqId)
  next()
}

module.exports = { requestId }
