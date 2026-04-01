const sql = require('mssql')
const { env } = require('./env')

const sqlConfig = {
  user: env.azureSql.user,
  password: env.azureSql.password,
  server: env.azureSql.server,
  database: env.azureSql.database,
  port: env.azureSql.port,
  options: env.azureSql.options,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
}

let poolPromise

function getPool () {
  if (!poolPromise) {
    poolPromise = new sql.ConnectionPool(sqlConfig)
      .connect()
      .then((pool) => {
        console.log('Connected to Azure SQL')
        return pool
      })
      .catch((error) => {
        poolPromise = null
        throw error
      })
  }

  return poolPromise
}

module.exports = {
  sql,
  getPool
}
