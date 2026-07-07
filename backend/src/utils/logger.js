const winston = require('winston')
const path = require('path')
const { env } = require('../config/env')

const LOG_DIR = path.resolve(process.env.LOG_DIR || './logs')

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.sssZ' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
)

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length ? ' ' + JSON.stringify(meta) : ''
    return `${timestamp} [${level}] ${message}${metaStr}`
  })
)

const transports = [
  // api.log — all info+ logs
  new winston.transports.File({
    filename: path.join(LOG_DIR, 'api.log'),
    level: 'info',
    format: logFormat,
    maxsize: 10 * 1024 * 1024, // 10MB
    maxFiles: 7
  }),
  // error.log — errors only
  new winston.transports.File({
    filename: path.join(LOG_DIR, 'error.log'),
    level: 'error',
    format: logFormat,
    maxsize: 10 * 1024 * 1024,
    maxFiles: 7
  }),
  // security.log — security events
  new winston.transports.File({
    filename: path.join(LOG_DIR, 'security.log'),
    level: 'warn',
    format: logFormat,
    maxsize: 10 * 1024 * 1024,
    maxFiles: 30
  })
]

if (env.nodeEnv !== 'production') {
  transports.push(new winston.transports.Console({ format: consoleFormat }))
} else {
  transports.push(new winston.transports.Console({
    format: logFormat,
    level: 'warn'
  }))
}

const logger = winston.createLogger({
  level: env.nodeEnv === 'development' ? 'debug' : 'info',
  transports,
  exitOnError: false
})

// Specialized security logger helper
logger.security = (message, meta = {}) => {
  logger.warn(message, { ...meta, log_type: 'security' })
}

// Specialized cron logger helper
logger.cron = (message, meta = {}) => {
  logger.info(message, { ...meta, log_type: 'cron' })
}

module.exports = logger
