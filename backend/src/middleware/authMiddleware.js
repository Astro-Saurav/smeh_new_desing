const { verifyAccessToken } = require('../utils/jwt')

function authenticate (req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const token = authHeader.slice(7)

  try {
    req.user = verifyAccessToken(token)
    return next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}

function authorize (...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' })
    }

    return next()
  }
}

module.exports = {
  authenticate,
  authorize
}
