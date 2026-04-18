const dotenv = require('dotenv')

dotenv.config()

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
  port: Number(process.env.PORT || 8080),
  nodeEnv: process.env.NODE_ENV || 'development',
  clientOrigin: fromEnv(['CLIENT_ORIGIN'], '*'),
  jwtSecret: fromEnv(['JWT_SECRET']),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '12h',
  refreshJwtSecret: fromEnv(['REFRESH_JWT_SECRET']),
  refreshJwtExpiresIn: process.env.REFRESH_JWT_EXPIRES_IN || '7d',
  refreshCookieName: process.env.REFRESH_COOKIE_NAME || 'mrt_refresh_token',
  refreshCookieSecure: String(process.env.REFRESH_COOKIE_SECURE || 'false').toLowerCase() === 'true',
  refreshCookieSameSite: process.env.REFRESH_COOKIE_SAME_SITE || 'lax',
  mongo: {
    uri: fromEnv(['MONGODB_URI', 'COSMOSDB_CONNECTION_STRING']),
    dbName: fromEnv(['MONGODB_DB_NAME'], 'manav_rachna_time')
  },
  azureBlob: {
    connectionString: fromEnv(['AZURE_STORAGE_CONNECTION_STRING']),
    containerName: process.env.AZURE_STORAGE_CONTAINER_NAME || 'news-media'
  }
}

const requiredValues = [
  ['JWT_SECRET', env.jwtSecret],
  ['REFRESH_JWT_SECRET', env.refreshJwtSecret],
  ['MONGODB_URI', env.mongo.uri],
  ['AZURE_STORAGE_CONNECTION_STRING', env.azureBlob.connectionString]
]

function validateEnv () {
  const missing = requiredValues
    .filter(([, value]) => !value)
    .map(([name]) => name)

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
}

module.exports = {
  env,
  validateEnv
}
