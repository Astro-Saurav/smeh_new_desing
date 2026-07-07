const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const { apiRouter } = require('./routes')
const { env } = require('./config/env')
const { notFoundHandler, errorHandler } = require('./middleware/errorMiddleware')
const { requestId } = require('./middleware/requestId')
const { helmetMiddleware, globalRateLimiter, sanitizeRequestBody } = require('./middleware/securityMiddleware')

const path = require('path')

const app = express()

// Inject correlation ID first
app.use(requestId)

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

app.use(helmetMiddleware)
app.use(cors({
  origin: env.clientOrigin === '*' ? true : env.clientOrigin,
  credentials: true
}))
app.use(cookieParser())
app.use(express.json({ limit: '20mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'))

// Standard security guards
app.use(globalRateLimiter)
app.use(sanitizeRequestBody)

app.use('/api', apiRouter)
app.use('/', apiRouter) // Fallback for Vercel Services prefix stripping

app.use(notFoundHandler)
app.use(errorHandler)

module.exports = {
  app
}
