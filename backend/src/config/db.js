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
    // Just a simple query to ensure SQLite is connected
    await prisma.$queryRaw`SELECT 1`
    logger.info('SQLite connected via Prisma')
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
