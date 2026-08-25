require('dotenv').config()

function fromEnv (keys, defaultValue) {
  for (const key of keys) {
    const value = process.env[key]
    if (typeof value === 'string' && value.trim() !== '') {
      return value.trim()
    }
  }
  return defaultValue
}

const env = {
  // Server
  port: Number(process.env.PORT || 8081),
  nodeEnv: process.env.NODE_ENV || 'development',
  clientOrigin: fromEnv(['CLIENT_ORIGIN'], 'http://localhost:3000'),

  // JWT
  jwtSecret: fromEnv(['JWT_SECRET'], 'local-dev-jwt-secret-change-in-production'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '60m',
  refreshJwtSecret: fromEnv(['REFRESH_JWT_SECRET'], 'local-dev-refresh-jwt-secret-change-in-production'),
  refreshJwtExpiresIn: process.env.REFRESH_JWT_EXPIRES_IN || '7d',
  refreshCookieName: process.env.REFRESH_COOKIE_NAME || 'mrt_refresh_token',
  // Default to TRUE — cookies must be secure (HTTPS-only) unless explicitly disabled
  refreshCookieSecure: String(process.env.REFRESH_COOKIE_SECURE ?? 'false').toLowerCase() === 'true',
  refreshCookieSameSite: process.env.REFRESH_COOKIE_SAME_SITE || 'lax',

  // Database
  databaseUrl: fromEnv(['DATABASE_URL'], 'file:./dev.db'),

  // Redis
  redisUrl: fromEnv(['REDIS_URL'], 'redis://localhost:6379'),

  // Uploads
  uploadBasePath: fromEnv(['UPLOAD_BASE_PATH'], './uploads'),
  maxUploadSizeBytes: Number(process.env.MAX_UPLOAD_SIZE_BYTES || 50 * 1024 * 1024), // 50MB

  // PM2
  pm2MaxMemory: process.env.PM2_MAX_MEMORY || '1G',

  // Security
  loginMaxAttempts: Number(process.env.LOGIN_MAX_ATTEMPTS || 5),
  loginLockoutMinutes: Number(process.env.LOGIN_LOCKOUT_MINUTES || 15),
  bcryptRounds: Number(process.env.BCRYPT_ROUNDS || 12),

  // Cron
  cronSecret: fromEnv(['CRON_SECRET'], 'local-dev-cron-secret-change-in-production'),

  // App
  appName: process.env.APP_NAME || 'Manav Rachna Time',
  appUrl: fromEnv(['APP_URL'], 'http://localhost:3000')
}

const requiredInProduction = [
  ['JWT_SECRET', env.jwtSecret],
  ['REFRESH_JWT_SECRET', env.refreshJwtSecret],
  ['DATABASE_URL', env.databaseUrl],
  ['CRON_SECRET', env.cronSecret]
]

function validateEnv () {
  if (env.nodeEnv === 'production') {
    const missing = requiredInProduction
      .filter(([, value]) => !value)
      .map(([name]) => name)

    if (missing.length > 0) {
      throw new Error(`[MRT] Missing required environment variables in production: ${missing.join(', ')}`)
    }
  }

  // Warn if running in production without HTTPS cookies
  if (env.nodeEnv === 'production' && !env.refreshCookieSecure) {
    console.warn('[MRT] WARNING: REFRESH_COOKIE_SECURE is false in production. Refresh tokens will be sent over HTTP!')
  }
}

module.exports = { env, validateEnv }
