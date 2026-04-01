const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const helmet = require('helmet')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const { apiRouter } = require('./routes')
const { env } = require('./config/env')
const { notFoundHandler, errorHandler } = require('./middleware/errorMiddleware')

const app = express()

app.use(helmet())
app.use(cors({
  origin: env.clientOrigin === '*' ? true : env.clientOrigin,
  credentials: true
}))
app.use(cookieParser())
app.use(express.json({ limit: '20mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'))

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false
}))

app.use('/api', apiRouter)

app.use(notFoundHandler)
app.use(errorHandler)

module.exports = {
  app
}
