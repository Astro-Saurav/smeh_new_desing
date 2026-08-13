const express = require('express')
const { asyncHandler } = require('../middleware/asyncHandler')
const { publishScheduledNews } = require('../services/newsService')
const { env } = require('../config/env')
const logger = require('../utils/logger')

const cronRouter = express.Router()

// ─── Secure endpoint for Cron triggers ───────────────────────────────────
// Requires X-Cron-Secret header in ALL environments (not just production).
// This prevents accidental unauthenticated triggering during local dev/testing.
cronRouter.post('/publish', asyncHandler(async (req, res) => {
  const authHeader = req.headers['x-cron-secret']

  if (!authHeader || authHeader !== env.cronSecret) {
    logger.warn('[Cron] Unauthorized cron attempt detected', {
      ip: req.ip,
      ua: req.headers['user-agent']
    })
    // Always return 401 — never reveal whether the secret exists
    return res.status(401).json({ message: 'Unauthorized' })
  }

  logger.info('[Cron] Starting scheduled news publication...')
  const publishedItems = await publishScheduledNews()

  return res.status(200).json({
    message: 'Cron executed successfully',
    publishedCount: publishedItems.length,
    publishedItems
  })
}))

module.exports = {
  cronRouter
}
