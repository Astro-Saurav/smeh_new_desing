const dotenv = require('dotenv')

dotenv.config()

const env = {
  port: Number(process.env.PORT || 8080),
  nodeEnv: process.env.NODE_ENV || 'development',
  clientOrigin: process.env.CLIENT_ORIGIN || '*',
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '12h',
  refreshJwtSecret: process.env.REFRESH_JWT_SECRET,
  refreshJwtExpiresIn: process.env.REFRESH_JWT_EXPIRES_IN || '7d',
  refreshCookieName: process.env.REFRESH_COOKIE_NAME || 'mrt_refresh_token',
  refreshCookieSecure: String(process.env.REFRESH_COOKIE_SECURE || 'false').toLowerCase() === 'true',
  refreshCookieSameSite: process.env.REFRESH_COOKIE_SAME_SITE || 'lax',
  azureSql: {
    user: process.env.AZURE_SQL_USER,
    password: process.env.AZURE_SQL_PASSWORD,
    server: process.env.AZURE_SQL_SERVER,
    database: process.env.AZURE_SQL_DATABASE,
    port: Number(process.env.AZURE_SQL_PORT || 1433),
    options: {
      encrypt: String(process.env.AZURE_SQL_ENCRYPT || 'true').toLowerCase() === 'true',
      trustServerCertificate: String(process.env.AZURE_SQL_TRUST_SERVER_CERT || 'false').toLowerCase() === 'true'
    }
  },
  azureBlob: {
    connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
    containerName: process.env.AZURE_STORAGE_CONTAINER_NAME || 'news-media'
  }
}

const requiredValues = [
  ['JWT_SECRET', env.jwtSecret],
  ['REFRESH_JWT_SECRET', env.refreshJwtSecret],
  ['AZURE_SQL_USER', env.azureSql.user],
  ['AZURE_SQL_PASSWORD', env.azureSql.password],
  ['AZURE_SQL_SERVER', env.azureSql.server],
  ['AZURE_SQL_DATABASE', env.azureSql.database],
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
