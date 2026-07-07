const { Queue } = require('bullmq')
const IORedis = require('ioredis')
const { env } = require('../config/env')
const logger = require('../utils/logger')

// Shared Redis connection for BullMQ
const redisConnection = new IORedis(env.redisUrl, {
  maxRetriesPerRequest: null, // Required by BullMQ
  enableReadyCheck: false
})

redisConnection.on('connect', () => logger.info('Redis connected'))
redisConnection.on('error', (err) => logger.error('Redis error', { message: err.message }))

const QUEUE_NAMES = {
  IMAGE_PROCESSING: 'image-processing',
  PUBLISH: 'publish',
  EMAIL: 'email',
  CLEANUP: 'cleanup',
  BACKUP: 'backup'
}

// Factory: creates a queue instance
function createQueue (name) {
  return new Queue(name, {
    connection: redisConnection,
    defaultJobOptions: {
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
      removeOnComplete: { count: 100 },
      removeOnFail: { count: 50 }
    }
  })
}

const queues = {
  imageProcessing: createQueue(QUEUE_NAMES.IMAGE_PROCESSING),
  publish: createQueue(QUEUE_NAMES.PUBLISH),
  email: createQueue(QUEUE_NAMES.EMAIL),
  cleanup: createQueue(QUEUE_NAMES.CLEANUP),
  backup: createQueue(QUEUE_NAMES.BACKUP)
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
