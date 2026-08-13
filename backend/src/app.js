const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const { apiRouter } = require('./routes')
const { env } = require('./config/env')
const { notFoundHandler, errorHandler } = require('./middleware/errorMiddleware')
const { requestId } = require('./middleware/requestId')
const {
  generateNonce,
  helmetWithNonce,
  globalRateLimiter,
  sanitizeRequestBody
} = require('./middleware/securityMiddleware')

const path = require('path')

const app = express()

// ─── Trust Nginx reverse proxy ────────────────────────────────────────────
// Required so express-rate-limit reads the real client IP from X-Forwarded-For
// and so req.protocol === 'https' behind Nginx.
app.set('trust proxy', 1)

// ─── Inject correlation ID first ─────────────────────────────────────────
app.use(requestId)

// ─── HTTPS redirect (works behind Nginx via X-Forwarded-Proto) ───────────
// Nginx handles this at the edge. Doing this here behind Next.js rewrites causes infinite redirect loops.
// app.use((req, res, next) => {
//   if (env.nodeEnv === 'production' && req.protocol !== 'https') {
//     return res.redirect(301, `https://${req.hostname}${req.originalUrl}`)
//   }
//   return next()
// })

// ─── Generate CSP nonce per request ──────────────────────────────────────
app.use(generateNonce)

// ─── Helmet (with nonce-based CSP + HSTS) ────────────────────────────────
app.use(helmetWithNonce)

// ─── CORS ─────────────────────────────────────────────────────────────────
app.use(cors({
  origin: env.clientOrigin === '*' ? false : env.clientOrigin, // never allow wildcard '*'
  credentials: true
}))

app.use(cookieParser())
app.use(express.json({ limit: '2mb' }))
app.use(express.urlencoded({ extended: true, limit: '2mb' }))
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'))

// ─── Standard security guards ─────────────────────────────────────────────
app.use(globalRateLimiter)
app.use(sanitizeRequestBody)

// ─── Static uploads — served with secure headers ─────────────────────────
// Helmet already applies to all routes but static routes need explicit
// Content-Disposition to prevent browsers from executing uploaded files.
app.use('/uploads', (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('Content-Disposition', 'inline')
  // Block direct execution of any script-like file from the uploads folder
  const unsafeExts = /\.(html?|svg|xml|js|php|asp|jsp|cgi)$/i
  if (unsafeExts.test(req.path)) {
    return res.status(403).json({ message: 'Forbidden' })
  }
  next()
}, express.static(path.join(__dirname, '../uploads')))

app.use('/api', apiRouter)
app.use('/', apiRouter) // Fallback for Vercel Services prefix stripping

app.use(notFoundHandler)
app.use(errorHandler)

module.exports = {
  app
}
