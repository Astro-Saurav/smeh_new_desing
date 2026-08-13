const { asyncHandler } = require('../middleware/asyncHandler')
const { v4: uuidv4 } = require('uuid')
const crypto = require('crypto')
const { env } = require('../config/env')
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/jwt')
const { comparePassword } = require('../utils/password')
const { findUserByEmail, findUserById, createUser, updateUserPassword } = require('../services/userService')
const {
  createRefreshTokenRecord,
  validateRefreshTokenRecord,
  revokeRefreshTokenById,
  revokeAllUserRefreshTokens
} = require('../services/tokenService')
const {
  recordAudit,
  recordLoginEvent,
  trackFailedLogin,
  clearFailedLogins
} = require('../services/auditService')
const R = require('../utils/response')

function parseDurationMs (duration) {
  const match = String(duration).trim().match(/^(\d+)([smhd])$/)
  if (!match) return 7 * 24 * 60 * 60 * 1000
  const amount = Number(match[1])
  const unitMap = { s: 1000, m: 60000, h: 3600000, d: 86400000 }
  return amount * unitMap[match[2]]
}

function getRefreshCookieOptions () {
  return {
    httpOnly: true,
    secure: env.refreshCookieSecure,
    sameSite: env.refreshCookieSameSite,
    path: '/api'
  }
}

async function issueTokenPair (res, user, previousTokenId = null) {
  const refreshTokenId = uuidv4()
  const sessionId = crypto.randomBytes(32).toString('hex') // Unique per login session
  const userId = user.id
  const refreshToken = signRefreshToken({ userId, tokenId: refreshTokenId, sessionId })
  const refreshExpiresAt = new Date(Date.now() + parseDurationMs(env.refreshJwtExpiresIn))

  if (previousTokenId) {
    await revokeRefreshTokenById(previousTokenId, refreshTokenId)
  }

  await createRefreshTokenRecord({ tokenId: refreshTokenId, userId, rawToken: refreshToken, expiresAt: refreshExpiresAt })

  const accessToken = signAccessToken({
    userId,
    email: user.email,
    role: user.role?.name || 'editor',
    sessionId // Bind session to token
  })

  res.cookie(env.refreshCookieName, refreshToken, {
    ...getRefreshCookieOptions(),
    maxAge: parseDurationMs(env.refreshJwtExpiresIn)
  })

  return accessToken
}

const register = asyncHandler(async (req, res) => {
  const { email, password, role } = req.validated.body
  const existing = await findUserByEmail(email)
  if (existing) return R.conflict(res, 'Email already registered')

  const user = await createUser({ email, password, roleName: role || 'editor' })

  await recordAudit({
    userId: req.user?.userId || null,
    action: 'user.registered',
    targetTable: 'users',
    targetId: user.id,
    newValue: { email: user.email },
    requestId: req.requestId,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent']
  })

  return R.created(res, {
    id: user.id,
    email: user.email,
    role: user.role?.name
  }, 'User created successfully')
})

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.validated.body
  const ipAddress = req.ip || 'unknown'
  const userAgent = req.headers['user-agent'] || 'unknown'

  // Check for lockout first
  const lockCheck = await trackFailedLogin({
    ipAddress,
    email,
    maxAttempts: env.loginMaxAttempts,
    lockoutMinutes: env.loginLockoutMinutes
  })

  if (lockCheck.locked) {
    await recordLoginEvent({ userId: null, ipAddress, userAgent, status: 'locked' })
    return R.error(res, 'Account temporarily locked due to too many failed attempts. Try again later.', 429)
  }

  const user = await findUserByEmail(email)

  if (!user || !user.password_hash) {
    await recordLoginEvent({ userId: null, ipAddress, userAgent, status: 'failed' })
    return R.unauthorized(res, 'Invalid credentials')
  }

  const isPasswordValid = await comparePassword(password, user.password_hash)
  if (!isPasswordValid) {
    await recordLoginEvent({ userId: user.id, ipAddress, userAgent, status: 'failed' })
    return R.unauthorized(res, 'Invalid credentials')
  }

  // Success — clear failed login record
  await clearFailedLogins({ ipAddress, email })
  await recordLoginEvent({ userId: user.id, ipAddress, userAgent, status: 'success' })

  await recordAudit({
    userId: user.id,
    action: 'user.login',
    targetTable: 'users',
    targetId: user.id,
    requestId: req.requestId,
    ipAddress,
    userAgent
  })

  const accessToken = await issueTokenPair(res, user)

  return R.success(res, {
    token: accessToken,
    user: { id: user.id, email: user.email, role: user.role?.name }
  }, 'Login successful')
})

const refresh = asyncHandler(async (req, res) => {
  const rawToken = req.cookies?.[env.refreshCookieName]
  if (!rawToken) return R.unauthorized(res, 'Refresh token missing')

  let payload
  try {
    payload = verifyRefreshToken(rawToken)
  } catch {
    return R.unauthorized(res, 'Invalid refresh token')
  }

  const tokenRecord = await validateRefreshTokenRecord({ tokenId: payload.tokenId, rawToken })
  if (!tokenRecord) return R.unauthorized(res, 'Refresh token revoked or expired')

  const user = await findUserById(payload.userId)
  if (!user) return R.unauthorized(res, 'User not found')

  const accessToken = await issueTokenPair(res, user, payload.tokenId)

  return R.success(res, {
    token: accessToken,
    user: { id: user.id, email: user.email, role: user.role?.name }
  }, 'Token refreshed')
})

const logout = asyncHandler(async (req, res) => {
  const rawToken = req.cookies?.[env.refreshCookieName]
  if (rawToken) {
    try {
      const payload = verifyRefreshToken(rawToken)
      await revokeRefreshTokenById(payload.tokenId)
      await revokeAllUserRefreshTokens(payload.userId)
    } catch {
      // Ignore errors during logout
    }
  }
  res.clearCookie(env.refreshCookieName, getRefreshCookieOptions())
  return R.success(res, null, 'Logged out successfully')
})

const me = asyncHandler(async (req, res) => {
  const user = await findUserById(req.user.userId)
  if (!user) return R.notFound(res, 'User not found')

  return R.success(res, {
    id: user.id,
    email: user.email,
    role: user.role?.name,
    is_2fa_enabled: user.is_2fa_enabled,
    created_at: user.created_at
  })
})

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body

  if (!currentPassword || !newPassword) {
    return R.badRequest(res, 'Current and new password are required')
  }

  const user = await findUserById(req.user.userId)
  if (!user || !user.password_hash) {
    return R.unauthorized(res, 'Invalid user')
  }

  const isPasswordValid = await comparePassword(currentPassword, user.password_hash)
  if (!isPasswordValid) {
    return R.badRequest(res, 'Invalid current password')
  }

  await updateUserPassword(user.id, newPassword)

  await recordAudit({
    userId: user.id,
    action: 'user.password_change',
    targetTable: 'users',
    targetId: user.id,
    requestId: req.requestId,
    ipAddress: req.ip || 'unknown',
    userAgent: req.headers['user-agent'] || 'unknown'
  })

  return R.success(res, null, 'Password changed successfully')
})

module.exports = { register, login, refresh, logout, me, changePassword }
