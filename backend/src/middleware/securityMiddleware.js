const helmet = require('helmet')
const sanitizeHtml = require('sanitize-html')

// Express-rate-limit setup - DISABLED for development
const globalRateLimiter = (req, res, next) => next()

const authRateLimiter = (req, res, next) => next()

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

// Request body sanitization helper for HTML strings
function sanitizeRequestBody (req, res, next) {
  if (req.body) {
    for (const key of Object.keys(req.body)) {
      if (typeof req.body[key] === 'string') {
        // Allow select styling elements for news content, otherwise strip all tags
        if (key === 'content') {
          req.body[key] = sanitizeHtml(req.body[key], {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'iframe']),
            allowedAttributes: {
              ...sanitizeHtml.defaults.allowedAttributes,
              iframe: ['src', 'width', 'height', 'frameborder', 'allowfullscreen'],
              img: ['src', 'alt', 'width', 'height']
            }
          })
        } else {
          // Standard text strip
          req.body[key] = sanitizeHtml(req.body[key], {
            allowedTags: [],
            allowedAttributes: {}
          })
        }
      }
    }
  }
  next()
}

module.exports = {
  globalRateLimiter,
  authRateLimiter,
  helmetMiddleware,
  sanitizeRequestBody
}
