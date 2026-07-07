const { Worker } = require('bullmq')
const path = require('path')
const fs = require('fs')
const { prisma } = require('../config/db')
const { redisConnection, QUEUE_NAMES } = require('../queue')
const logger = require('../utils/logger')
const { env } = require('../config/env')

const UPLOAD_ROOT = path.resolve(env.uploadBasePath)
const TEMP_DIR = path.join(UPLOAD_ROOT, 'temp')
const MAX_TEMP_AGE_MS = 60 * 60 * 1000 // 1 hour

async function cleanTempFiles () {
  if (!fs.existsSync(TEMP_DIR)) return { removed: 0 }
  const now = Date.now()
  const files = fs.readdirSync(TEMP_DIR)
  let removed = 0
  for (const file of files) {
    const filePath = path.join(TEMP_DIR, file)
    const stat = fs.statSync(filePath)
    if (now - stat.mtimeMs > MAX_TEMP_AGE_MS) {
      fs.unlinkSync(filePath)
      removed++
    }
  }
  return { removed }
}

async function expireRefreshTokens () {
  const result = await prisma.refreshToken.deleteMany({
    where: {
      OR: [
        { expires_at: { lt: new Date() } },
        { revoked_at: { not: null } }
      ]
    }
  })
  return { deletedTokens: result.count }
}

const cleanupWorker = new Worker(
  QUEUE_NAMES.CLEANUP,
  async (job) => {
    logger.cron('[cleanup-worker] Running cleanup tasks')
    const [tempResult, tokenResult] = await Promise.all([
      cleanTempFiles(),
      expireRefreshTokens()
    ])
    logger.cron('[cleanup-worker] Done', { ...tempResult, ...tokenResult })
    return { ...tempResult, ...tokenResult }
  },
  { connection: redisConnection, concurrency: 1 }
)

cleanupWorker.on('failed', (job, err) => {
  logger.error('[cleanup-worker] Job failed', { jobId: job.id, error: err.message })
})

module.exports = { cleanupWorker }
