const { Worker } = require('bullmq')
const { redisConnection, QUEUE_NAMES } = require('../queue')
const logger = require('../utils/logger')
const { exec } = require('child_process')
const path = require('path')

function runBackupScript (type) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.resolve(__dirname, '../../scripts/backup.sh')
    logger.cron(`[backup-worker] Running backup script: ${scriptPath} ${type}`)
    
    exec(`bash "${scriptPath}" ${type}`, (error, stdout, stderr) => {
      if (error) {
        logger.error('[backup-worker] Backup execution error', { error: error.message, stderr })
        return reject(error)
      }
      logger.cron('[backup-worker] Backup execution output', { stdout })
      resolve(stdout)
    })
  })
}

const backupWorker = new Worker(
  QUEUE_NAMES.BACKUP,
  async (job) => {
    const { type } = job.data
    logger.cron(`[backup-worker] Processing job ${job.id}`, { type })
    await runBackupScript(type || 'incremental')
  },
  {
    connection: redisConnection,
    concurrency: 1
  }
)

backupWorker.on('failed', (job, err) => {
  logger.error('[backup-worker] Job failed', { jobId: job.id, error: err.message })
})

module.exports = { backupWorker }
