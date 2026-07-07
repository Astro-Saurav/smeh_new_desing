const express = require('express')
const { asyncHandler } = require('../middleware/asyncHandler')
const { publishScheduledNews } = require('../services/newsService')
const { env } = require('../config/env')

const cronRouter = express.Router()

// Secure endpoint for Vercel Cron
cronRouter.post('/publish', asyncHandler(async (req, res) => {
  const authHeader = req.headers['x-cron-secret']

  // In production, require the secret
  if (env.nodeEnv === 'production' && authHeader !== env.cronSecret) {
    console.warn('[Cron] Unauthorized cron attempt detected')
    return res.status(401).json({ message: 'Unauthorized' })
  }

  console.log('[Cron] Starting scheduled news publication...')
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
