const { Worker } = require('bullmq')
const { prisma } = require('../config/db')
const { redisConnection, QUEUE_NAMES } = require('../queue')
const logger = require('../utils/logger')

const publishWorker = new Worker(
  QUEUE_NAMES.PUBLISH,
  async (job) => {
    const now = new Date()
    logger.cron('[publish-worker] Checking for scheduled news', { timestamp: now })

    const toPublish = await prisma.news.findMany({
      where: {
        status: 'scheduled',
        scheduled_publish_at: { lte: now },
        deleted_at: null
      }
    })

    if (toPublish.length === 0) {
      logger.cron('[publish-worker] No scheduled news to publish')
      return { published: 0 }
    }

    for (const item of toPublish) {
      await prisma.news.update({
        where: { id: item.id },
        data: {
          status: 'published',
          published_at: now,
          updated_at: now
        }
      })
      logger.cron(`[publish-worker] Published: ${item.title}`, { id: item.id })
    }

    return { published: toPublish.length }
  },
  { connection: redisConnection, concurrency: 1 }
)

publishWorker.on('failed', (job, err) => {
  logger.error('[publish-worker] Job failed', { jobId: job.id, error: err.message })
})

module.exports = { publishWorker }
