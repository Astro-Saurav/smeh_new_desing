const News = require('../models/News')
const Category = require('../models/Category')

async function getStatusCounts () {
  const counts = await News.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ])

  const baseline = {
    draft: 0,
    published: 0,
    scheduled: 0
  }

  counts.forEach(c => {
    baseline[c._id] = c.count
  })

  return baseline
}

async function getCategoryCounts () {
  const results = await News.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } }
  ])
  
  const categories = await Category.find()
  
  return categories.map(cat => {
    const stat = results.find(r => r._id && r._id.toString() === cat._id.toString())
    return {
      id: cat._id,
      name: cat.name,
      count: stat ? stat.count : 0
    }
  }).sort((a,b) => b.count - a.count || a.name.localeCompare(b.name))
}

async function getMonthlyPublishTrend () {
  const results = await News.aggregate([
    { $match: { status: 'published', published_at: { $ne: null } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$published_at' } },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ])

  return results.map(r => ({
    month: r._id,
    count: r.count
  }))
}

async function getOverviewAnalytics () {
  const [statusCounts, categoryCounts, monthlyTrend] = await Promise.all([
    getStatusCounts(),
    getCategoryCounts(),
    getMonthlyPublishTrend()
  ])

  const totalNews = statusCounts.draft + statusCounts.published + statusCounts.scheduled

  return {
    totals: {
      totalNews,
      ...statusCounts
    },
    categoryCounts,
    monthlyTrend
  }
}

module.exports = {
  getOverviewAnalytics
}
