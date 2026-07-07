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
  port: Number(process.env.PORT || 8080),
  nodeEnv: process.env.NODE_ENV || 'development',
  clientOrigin: fromEnv(['CLIENT_ORIGIN'], 'http://localhost:3000'),

  // JWT
  jwtSecret: fromEnv(['JWT_SECRET']),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
  refreshJwtSecret: fromEnv(['REFRESH_JWT_SECRET']),
  refreshJwtExpiresIn: process.env.REFRESH_JWT_EXPIRES_IN || '7d',
  refreshCookieName: process.env.REFRESH_COOKIE_NAME || 'mrt_refresh_token',
  refreshCookieSecure: String(process.env.REFRESH_COOKIE_SECURE || 'false').toLowerCase() === 'true',
  refreshCookieSameSite: process.env.REFRESH_COOKIE_SAME_SITE || 'strict',

  // Database
  databaseUrl: fromEnv(['DATABASE_URL']),

  // Redis
  redisUrl: fromEnv(['REDIS_URL'], 'redis://localhost:6379'),

  // Uploads
  uploadBasePath: fromEnv(['UPLOAD_BASE_PATH'], './uploads'),
  maxUploadSizeBytes: Number(process.env.MAX_UPLOAD_SIZE_BYTES || 20 * 1024 * 1024), // 20MB

  // PM2
  pm2MaxMemory: process.env.PM2_MAX_MEMORY || '1G',

  // Security
  loginMaxAttempts: Number(process.env.LOGIN_MAX_ATTEMPTS || 5),
  loginLockoutMinutes: Number(process.env.LOGIN_LOCKOUT_MINUTES || 15),
  bcryptRounds: Number(process.env.BCRYPT_ROUNDS || 12),

  // Cron
  cronSecret: fromEnv(['CRON_SECRET'], 'dev_cron_secret'),

  // App
  appName: process.env.APP_NAME || 'Manav Rachna Time',
  appUrl: fromEnv(['APP_URL'], 'http://localhost:3000')
}

const requiredInProduction = [
  ['JWT_SECRET', env.jwtSecret],
  ['REFRESH_JWT_SECRET', env.refreshJwtSecret],
  ['DATABASE_URL', env.databaseUrl]
]

const requiredAlways = [
  ['JWT_SECRET', env.jwtSecret],
  ['REFRESH_JWT_SECRET', env.refreshJwtSecret]
]

function validateEnv () {
  const checkList = env.nodeEnv === 'production' ? requiredInProduction : requiredAlways
  const missing = checkList
    .filter(([, value]) => !value)
    .map(([name]) => name)

  if (missing.length > 0) {
    throw new Error(`[MRT] Missing required environment variables: ${missing.join(', ')}`)
  }
}

module.exports = { env, validateEnv }
