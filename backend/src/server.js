const { app } = require('./app')
const { env, validateEnv } = require('./config/env')
const { getPool } = require('./config/db')
const { startPublisherJob } = require('./jobs/publisherJob')

async function startServer () {
  try {
    validateEnv()
    await getPool()
    startPublisherJob()

    app.listen(env.port, () => {
      console.log(`Server running on port ${env.port}`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()
