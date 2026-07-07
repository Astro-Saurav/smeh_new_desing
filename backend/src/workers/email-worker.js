const { Worker } = require('bullmq')
const { redisConnection, QUEUE_NAMES } = require('../queue')
const logger = require('../utils/logger')

// Dummy email sender implementation (can be connected to Nodemailer/SES/etc.)
async function sendEmail ({ to, subject, template, data }) {
  logger.info('[email-worker] Sending email', { to, subject, template, data })
  // In a real application, implement SMTP/API transport sending here
  return { success: true, messageId: `msg-${Date.now()}` }
}

const emailWorker = new Worker(
  QUEUE_NAMES.EMAIL,
  async (job) => {
    const { to, subject, template, data } = job.data
    logger.info(`[email-worker] Processing job ${job.id}`, { to, subject })
    await sendEmail({ to, subject, template, data })
  },
  {
    connection: redisConnection,
    concurrency: 5
  }
)

emailWorker.on('failed', (job, err) => {
  logger.error('[email-worker] Job failed', { jobId: job.id, error: err.message })
})

module.exports = { emailWorker }
