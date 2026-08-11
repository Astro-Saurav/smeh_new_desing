const { env } = require('../config/env')
const logger = require('../utils/logger')

// Shared Redis connection for BullMQ
let redisConnection
try {
  const IORedis = require('ioredis-mock')
  redisConnection = new IORedis(env.redisUrl, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false
  })
} catch(e) {
  redisConnection = {
    on: () => {},
    quit: () => {}
  }
}

const QUEUE_NAMES = {
  IMAGE_PROCESSING: 'image-processing',
  PUBLISH: 'publish',
  EMAIL: 'email',
  CLEANUP: 'cleanup',
  BACKUP: 'backup'
}

const queues = {
  imageProcessing: { add: async () => logger.info('Mock: Added to imageProcessing queue') },
  publish: { add: async () => logger.info('Mock: Added to publish queue') },
  email: { add: async () => logger.info('Mock: Added to email queue') },
  cleanup: { add: async () => logger.info('Mock: Added to cleanup queue') },
  backup: { add: async () => logger.info('Mock: Added to backup queue') }
}

// Enqueue helpers
async function enqueueImageProcessing (mediaId, filePath, options = {}) {
  return queues.imageProcessing.add('process', { mediaId, filePath, ...options })
}

async function enqueueEmail (to, subject, template, data = {}) {
  return queues.email.add('send', { to, subject, template, data })
}

async function enqueueBackup (type = 'incremental') {
  return queues.backup.add('run', { type, timestamp: new Date().toISOString() })
}

module.exports = {
  redisConnection,
  queues,
  QUEUE_NAMES,
  enqueueImageProcessing,
  enqueueEmail,
  enqueueBackup
}
