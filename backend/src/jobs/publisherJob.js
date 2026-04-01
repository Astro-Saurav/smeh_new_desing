const cron = require('node-cron')
const { publishScheduledNews } = require('../services/newsService')

function startPublisherJob () {
  cron.schedule('* * * * *', async () => {
    try {
      const publishedItems = await publishScheduledNews()

      if (publishedItems.length > 0) {
        console.log(`[publisherJob] Published ${publishedItems.length} scheduled news item(s)`)
      }
    } catch (error) {
      console.error('[publisherJob] Failed to publish scheduled news:', error.message)
    }
  })
}

module.exports = {
  startPublisherJob
}
