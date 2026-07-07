const { app } = require('./app')
const { env, validateEnv } = require('./config/env')
const { connectDB, disconnectDB } = require('./config/db')
const logger = require('./utils/logger')

async function startServer () {
  try {
    validateEnv()
    await connectDB()

    const server = app.listen(env.port, () => {
      logger.info(`MRT API running`, {
        port: env.port,
        environment: env.nodeEnv,
        pid: process.pid
      })

      // Signal PM2 / Docker that we're ready
      if (process.send) {
        process.send('ready')
      }
    })

    // Graceful shutdown
    const shutdown = async (signal) => {
      logger.info(`${signal} received — shutting down gracefully`)
      server.close(async () => {
        await disconnectDB()
        logger.info('Server closed')
        process.exit(0)
      })

      // Force exit after 10s
      setTimeout(() => {
        logger.error('Forced shutdown after timeout')
        process.exit(1)
      }, 10000)
    }

    process.on('SIGTERM', () => shutdown('SIGTERM'))
    process.on('SIGINT', () => shutdown('SIGINT'))
  } catch (error) {
    logger.error('Failed to start server', { error: error.message, stack: error.stack })
    process.exit(1)
  }
}

startServer()
