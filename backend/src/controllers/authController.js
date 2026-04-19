const { asyncHandler } = require('../middleware/asyncHandler')
const { v4: uuidv4 } = require('uuid')
const { env } = require('../config/env')
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/jwt')
const { comparePassword } = require('../utils/password')
const { createUser, findUserByEmail, findUserById } = require('../services/userService')
const {
  createRefreshTokenRecord,
  validateRefreshTokenRecord,
  revokeRefreshTokenById,
  revokeAllUserRefreshTokens
} = require('../services/tokenService')

function parseDurationMs (duration) {
  const value = String(duration).trim()
  const match = value.match(/^(\d+)([smhd])$/)

  if (!match) {
    return 7 * 24 * 60 * 60 * 1000
  }

  const amount = Number(match[1])
  const unit = match[2]
  const unitMap = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000
  }

  return amount * unitMap[unit]
}

function getRefreshCookieOptions () {
  return {
    httpOnly: true,
    secure: env.refreshCookieSecure,
    sameSite: env.refreshCookieSameSite,
    path: '/api/auth'
  }
}

async function issueTokenPair (res, user, previousTokenId = null) {
  const refreshTokenId = uuidv4()
  const userId = String(user._id || user.id)
  const refreshToken = signRefreshToken({ userId, tokenId: refreshTokenId })
  const refreshExpiresAt = new Date(Date.now() + parseDurationMs(env.refreshJwtExpiresIn))

  if (previousTokenId) {
    await revokeRefreshTokenById(previousTokenId, refreshTokenId)
  }

  await createRefreshTokenRecord({
    tokenId: refreshTokenId,
    userId,
    rawToken: refreshToken,
    expiresAt: refreshExpiresAt
  })

  const accessToken = signAccessToken({
    userId,
    email: user.email,
    role: user.role
  })

  res.cookie(env.refreshCookieName, refreshToken, {
    ...getRefreshCookieOptions(),
    maxAge: parseDurationMs(env.refreshJwtExpiresIn)
  })

  return accessToken
}

const register = asyncHandler(async (req, res) => {
  const { email, password, role } = req.validated.body
  const existingUser = await findUserByEmail(email)

  if (existingUser) {
    return res.status(409).json({ message: 'Email already registered' })
  }

  const user = await createUser({ email, password, role })

  return res.status(201).json({
    user,
    message: 'User created successfully'
  })
})

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.validated.body
  const user = await findUserByEmail(email)

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  const isPasswordValid = await comparePassword(password, user.password_hash)

  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  const token = await issueTokenPair(res, user)

  return res.status(200).json({
    token,
    user: {
      id: String(user._id || user.id),
      email: user.email,
      role: user.role
    }
  })
})

const refresh = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.[env.refreshCookieName]

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token missing' })
  }

  let payload

  try {
    payload = verifyRefreshToken(refreshToken)
  } catch (error) {
    return res.status(401).json({ message: 'Invalid refresh token' })
  }

  const tokenRecord = await validateRefreshTokenRecord({
    tokenId: payload.tokenId,
    rawToken: refreshToken
  })

  if (!tokenRecord) {
    return res.status(401).json({ message: 'Refresh token revoked or expired' })
  }

  const user = await findUserById(payload.userId)

  if (!user) {
    return res.status(401).json({ message: 'User not found' })
  }

  const token = await issueTokenPair(res, user, payload.tokenId)

  return res.status(200).json({
    token,
    user
  })
})

const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.[env.refreshCookieName]

  if (refreshToken) {
    try {
      const payload = verifyRefreshToken(refreshToken)
      await revokeRefreshTokenById(payload.tokenId)
      await revokeAllUserRefreshTokens(payload.userId)
    } catch (error) {
      // Ignore token verification failures during logout.
    }
  }

  res.clearCookie(env.refreshCookieName, getRefreshCookieOptions())
  return res.status(200).json({ message: 'Logged out' })
})

const me = asyncHandler(async (req, res) => {
  const user = await findUserById(req.user.userId)

  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  return res.status(200).json(user)
})

module.exports = {
  register,
  login,
  refresh,
  logout,
  me
}
