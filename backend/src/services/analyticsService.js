const { getPool } = require('../config/db')

async function getStatusCounts () {
  const pool = await getPool()
  const result = await pool.request().query(`
    SELECT status, COUNT(*) AS count
    FROM news
    GROUP BY status
  `)

  const baseline = {
    draft: 0,
    published: 0,
    scheduled: 0
  }

  for (const row of result.recordset) {
    baseline[row.status] = Number(row.count)
  }

  return baseline
}

async function getCategoryCounts () {
  const pool = await getPool()
  const result = await pool.request().query(`
    SELECT c.id, c.name, COUNT(n.id) AS count
    FROM categories c
    LEFT JOIN news n ON n.category_id = c.id
    GROUP BY c.id, c.name
    ORDER BY count DESC, c.name ASC
  `)

  return result.recordset.map((row) => ({
    id: row.id,
    name: row.name,
    count: Number(row.count)
  }))
}

async function getMonthlyPublishTrend () {
  const pool = await getPool()
  const result = await pool.request().query(`
    SELECT
      FORMAT(published_at, 'yyyy-MM') AS month,
      COUNT(*) AS count
    FROM news
    WHERE status = 'published' AND published_at IS NOT NULL
    GROUP BY FORMAT(published_at, 'yyyy-MM')
    ORDER BY month ASC
  `)

  return result.recordset.map((row) => ({
    month: row.month,
    count: Number(row.count)
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
