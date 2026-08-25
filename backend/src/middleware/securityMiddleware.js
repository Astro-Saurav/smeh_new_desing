const crypto = require('crypto')
const helmet = require('helmet')
const sanitizeHtml = require('sanitize-html')
const rateLimit = require('express-rate-limit')
const { RedisStore } = require('rate-limit-redis')
const { env } = require('../config/env')
const logger = require('../utils/logger')

// ─── Redis client (shared ioredis instance) ───────────────────────────────
// Only use Redis in production. In development, fall back to in-memory rate limiting.
let redisClient = null

function getRedisClient () {
  if (env.nodeEnv !== 'production') return null // skip Redis in dev
  if (redisClient) return redisClient
  try {
    const { default: Redis } = require('ioredis')
    redisClient = new Redis(env.redisUrl, {
      maxRetriesPerRequest: 3,
      connectTimeout: 5000,
      lazyConnect: true,
      retryStrategy: (times) => (times > 3 ? null : Math.min(times * 200, 2000))
    })
    redisClient.on('error', (err) => {
      logger.warn('[Redis] Rate-limit store connection error (falling back to memory):', err.message)
    })
    redisClient.on('close', () => {
      logger.warn('[Redis] Rate-limit store connection closed')
    })
    redisClient.on('end', () => {
      logger.warn('[Redis] Rate-limit store connection ended')
      redisClient = null
    })
    redisClient.on('connect', () => {
      logger.info('[Redis] Rate-limit store connected')
    })
  } catch (err) {
    logger.warn('[Redis] Could not initialise ioredis for rate limiting:', err.message)
  }
  return redisClient
}

function buildRedisStore (prefix) {
  try {
    const client = getRedisClient()
    if (!client) return undefined // fall back to in-memory
    return new RedisStore({
      sendCommand: (...args) => client.call(...args),
      prefix
    })
  } catch (err) {
    logger.warn('[Redis] buildRedisStore failed, falling back to in-memory:', err.message)
    return undefined
  }
}


// ─── Global rate limit: 1000 requests per 15 minutes ─────────────────────
const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 1000,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  store: buildRedisStore('rl:global:'),
  message: { message: 'Too many requests, please try again later.' }
})

// ─── Auth rate limit: 20 requests per 15 minutes ─────────────────────────
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  store: buildRedisStore('rl:auth:'),
  message: { message: 'Too many authentication attempts, please try again later.' }
})

// ─── Nonce generation ─────────────────────────────────────────────────────
/**
 * Generates a fresh cryptographic nonce per request and attaches it to
 * res.locals.cspNonce so templates/SSR can embed it.
 */
function generateNonce (req, res, next) {
  res.locals.cspNonce = crypto.randomBytes(16).toString('base64')
  next()
}

// ─── Helmet with nonce-based CSP (NO unsafe-inline / unsafe-eval) ─────────
function helmetWithNonce (req, res, next) {
  const nonce = res.locals.cspNonce || crypto.randomBytes(16).toString('base64')

  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          `'nonce-${nonce}'`
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'", // required for Tailwind/CSS-in-JS injected styles only
          'https://fonts.googleapis.com'
        ],
        fontSrc: [
          "'self'",
          'https://fonts.gstatic.com'
        ],
        imgSrc: [
          "'self'",
          'data:',
          'blob:',
          'https:'
        ],
        mediaSrc: [
          "'self'",
          'https://www.youtube.com',
          'https://www.youtube-nocookie.com'
        ],
        frameSrc: [
          "'self'",
          'https://www.youtube.com',
          'https://www.youtube-nocookie.com'
        ],
        connectSrc: [
          "'self'",
          'https:'
        ],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'self'"]
      }
    },
    crossOriginEmbedderPolicy: false,
    // Ensure HSTS is on (1 year, includeSubDomains)
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    }
  })(req, res, next)
}

// ─── Recursive sanitization helper ───────────────────────────────────────
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

// ─── Request body sanitization middleware ────────────────────────────────
function sanitizeRequestBody (req, res, next) {
  if (req.body) {
    req.body = sanitizeData(req.body)
  }
  next()
}

module.exports = {
  globalRateLimiter,
  authRateLimiter,
  generateNonce,
  helmetWithNonce,
  sanitizeRequestBody
}
