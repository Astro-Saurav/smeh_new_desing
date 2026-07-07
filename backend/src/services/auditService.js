const { prisma } = require('../config/db')
const logger = require('../utils/logger')

/**
 * Record an audit log entry
 * @param {object} params
 * @param {string} params.userId - Acting user ID (or null for system actions)
 * @param {string} params.action - Action name e.g. 'news.created', 'user.deleted'
 * @param {string} params.targetTable - Database table name
 * @param {string} [params.targetId] - Target record ID
 * @param {object} [params.oldValue] - Previous state (for updates)
 * @param {object} [params.newValue] - New state
 * @param {string} [params.requestId] - HTTP request ID
 * @param {string} [params.ipAddress] - Client IP
 * @param {string} [params.userAgent] - Client user agent
 */
async function recordAudit ({
  userId,
  action,
  targetTable,
  targetId,
  oldValue,
  newValue,
  requestId,
  ipAddress,
  userAgent
}) {
  try {
    await prisma.auditLog.create({
      data: {
        user_id: userId || null,
        action,
        target_table: targetTable,
        target_id: targetId ? String(targetId) : null,
        old_value: oldValue || undefined,
        new_value: newValue || undefined,
        request_id: requestId || null,
        ip_address: ipAddress || null,
        user_agent: userAgent || null
      }
    })
  } catch (err) {
    // Audit failures must never crash the main operation
    logger.error('Failed to write audit log', { action, error: err.message })
  }
}

/**
 * Record a login event (success or failure)
 */
async function recordLoginEvent ({ userId, ipAddress, userAgent, status }) {
  try {
    await prisma.loginHistory.create({
      data: {
        user_id: userId || null,
        ip_address: ipAddress || 'unknown',
        user_agent: userAgent || null,
        status // 'success' | 'failed' | 'locked'
      }
    })
  } catch (err) {
    logger.error('Failed to write login history', { error: err.message })
  }
}

/**
 * Track failed login and return lockout status
 */
async function trackFailedLogin ({ ipAddress, email, maxAttempts, lockoutMinutes }) {
  const existing = await prisma.failedLogin.findUnique({
    where: { ip_address_email: { ip_address: ipAddress, email } }
  })

  if (existing) {
    // If already locked and lock hasn't expired, return locked
    if (existing.locked_until && existing.locked_until > new Date()) {
      return { locked: true, lockedUntil: existing.locked_until }
    }

    // Increment
    const updated = await prisma.failedLogin.update({
      where: { ip_address_email: { ip_address: ipAddress, email } },
      data: {
        count: { increment: 1 },
        locked_until: existing.count + 1 >= maxAttempts
          ? new Date(Date.now() + lockoutMinutes * 60 * 1000)
          : null
      }
    })

    if (updated.locked_until) {
      return { locked: true, lockedUntil: updated.locked_until }
    }
    return { locked: false, attempts: updated.count }
  }

  // First failure
  await prisma.failedLogin.create({
    data: { ip_address: ipAddress, email, count: 1 }
  })
  return { locked: false, attempts: 1 }
}

/**
 * Reset failed login counter on success
 */
async function clearFailedLogins ({ ipAddress, email }) {
  await prisma.failedLogin.deleteMany({
    where: { ip_address: ipAddress, email }
  })
}

module.exports = {
  recordAudit,
  recordLoginEvent,
  trackFailedLogin,
  clearFailedLogins
}
