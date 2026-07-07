const { connectDB } = require('../config/db')
const logger = require('../utils/logger')

async function startWorkers () {
  logger.info('[runner] Connecting to database...')
  await connectDB()

  // Import and start all workers
  require('./image-worker')
  require('./publish-worker')
  require('./cleanup-worker')
  require('./email-worker')
  require('./backup-worker')

  logger.info('[runner] All workers started')
}

startWorkers().catch((err) => {
  logger.error('[runner] Failed to start workers', { error: err.message })
  process.exit(1)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('[runner] SIGTERM received — graceful shutdown')
  process.exit(0)
})
