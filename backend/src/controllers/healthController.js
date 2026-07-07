const { prisma } = require('../config/db')
const IORedis = require('ioredis')
const { env } = require('../config/env')
const os = require('os')
const R = require('../utils/response')
const { asyncHandler } = require('../middleware/asyncHandler')

// Health: The Node process is alive
const live = asyncHandler(async (req, res) => {
  return res.status(200).json({
    success: true,
    status: 'live',
    timestamp: new Date().toISOString()
  })
})

// Ready: All dependencies are available
const ready = asyncHandler(async (req, res) => {
  const checks = {}

  // PostgreSQL
  try {
    await prisma.$queryRaw`SELECT 1`
    checks.postgresql = 'ok'
  } catch (err) {
    checks.postgresql = 'error'
  }

  // Redis
  try {
    const redis = new IORedis(env.redisUrl, { lazyConnect: true, connectTimeout: 3000 })
    await redis.ping()
    await redis.quit()
    checks.redis = 'ok'
  } catch {
    checks.redis = 'error'
  }

  const allOk = Object.values(checks).every(v => v === 'ok')
  const statusCode = allOk ? 200 : 503

  return res.status(statusCode).json({
    success: allOk,
    status: allOk ? 'ready' : 'degraded',
    checks,
    timestamp: new Date().toISOString()
  })
})

// Health: Full application metrics
const health = asyncHandler(async (req, res) => {
  const memUsage = process.memoryUsage()
  const cpuUsage = process.cpuUsage()
  const uptime = process.uptime()

  let dbConnections = 'unknown'
  try {
    const result = await prisma.$queryRaw`SELECT count(*) FROM pg_stat_activity WHERE state = 'active'`
    dbConnections = Number(result[0].count)
  } catch { /* ignore */ }

  return R.success(res, {
    version: process.env.npm_package_version || '1.0.0',
    environment: env.nodeEnv,
    uptime_seconds: Math.round(uptime),
    node_version: process.version,
    memory: {
      heap_used_mb: Math.round(memUsage.heapUsed / 1024 / 1024),
      heap_total_mb: Math.round(memUsage.heapTotal / 1024 / 1024),
      rss_mb: Math.round(memUsage.rss / 1024 / 1024)
    },
    cpu: {
      user_ms: Math.round(cpuUsage.user / 1000),
      system_ms: Math.round(cpuUsage.system / 1000)
    },
    system: {
      platform: os.platform(),
      arch: os.arch(),
      total_memory_gb: (os.totalmem() / 1024 / 1024 / 1024).toFixed(2),
      free_memory_gb: (os.freemem() / 1024 / 1024 / 1024).toFixed(2),
      load_avg: os.loadavg()
    },
    database: {
      active_connections: dbConnections
    },
    timestamp: new Date().toISOString()
  }, 'System health')
})

module.exports = { live, ready, health }
