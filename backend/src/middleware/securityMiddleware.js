const helmet = require('helmet')
const sanitizeHtml = require('sanitize-html')

const rateLimit = require('express-rate-limit')

// Global rate limit: 1000 requests per 15 minutes
const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 1000,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' }
})

// Auth rate limit: 20 requests per 15 minutes
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Too many authentication attempts, please try again later.' }
})

// Helmet configured for Strict Content Security Policy
const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
      mediaSrc: ["'self'", 'https://www.youtube.com'],
      frameSrc: ["'self'", 'https://www.youtube.com'],
      connectSrc: ["'self'", 'https:']
    }
  },
  crossOriginEmbedderPolicy: false
})

// Recursive sanitization helper
function sanitizeData (data, keyName = '') {
  if (typeof data === 'string') {
    if (keyName === 'content') {
      return sanitizeHtml(data, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'iframe']),
        allowedAttributes: {
          ...sanitizeHtml.defaults.allowedAttributes,
          iframe: ['src', 'width', 'height', 'frameborder', 'allowfullscreen'],
          img: ['src', 'alt', 'width', 'height']
        }
      })
    }
    return sanitizeHtml(data, {
      allowedTags: [],
      allowedAttributes: {}
    })
  }

  if (Array.isArray(data)) {
    return data.map(item => sanitizeData(item, keyName))
  }

  if (typeof data === 'object' && data !== null) {
    const sanitizedObj = {}
    for (const [key, value] of Object.entries(data)) {
      sanitizedObj[key] = sanitizeData(value, key)
    }
    return sanitizedObj
  }

  return data
}

// Request body sanitization helper for HTML strings
function sanitizeRequestBody (req, res, next) {
  if (req.body) {
    req.body = sanitizeData(req.body)
  }
  next()
}

module.exports = {
  globalRateLimiter,
  authRateLimiter,
  helmetMiddleware,
  sanitizeRequestBody
}
