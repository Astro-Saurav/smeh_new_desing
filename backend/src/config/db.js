const { PrismaClient } = require('@prisma/client')
const { env } = require('./env')
const logger = require('../utils/logger')

const prisma = new PrismaClient({
  log: env.nodeEnv === 'development'
    ? [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' }
      ]
    : [
        { emit: 'event', level: 'error' }
      ]
})

if (env.nodeEnv === 'development') {
  prisma.$on('query', (e) => {
    logger.debug('Prisma Query', {
      query: e.query,
      duration_ms: e.duration
    })
  })
}

prisma.$on('error', (e) => {
  logger.error('Prisma Error', { message: e.message })
})

async function connectDB () {
  try {
    await prisma.$queryRaw`PRAGMA journal_mode = WAL;`
    await prisma.$queryRaw`PRAGMA busy_timeout = 5000;`
    logger.info('SQLite connected via Prisma (WAL Mode Enabled)')
  } catch (err) {
    logger.error('SQLite connection failed', { message: err.message })
    process.exit(1)
  }
}

async function disconnectDB () {
  await prisma.$disconnect()
  logger.info('SQLite disconnected')
}

module.exports = { prisma, connectDB, disconnectDB }
