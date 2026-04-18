const RefreshToken = require('../models/RefreshToken')
const { hashPassword, comparePassword } = require('../utils/password')

async function createRefreshTokenRecord ({ tokenId, userId, rawToken, expiresAt }) {
  const tokenHash = await hashPassword(rawToken)
  const refreshToken = new RefreshToken({
    user: userId,
    token_hash: tokenHash,
    expires_at: expiresAt
  })
  
  if (tokenId) refreshToken._id = tokenId

  await refreshToken.save()
  return refreshToken._id
}

async function findValidRefreshTokenRecord (tokenId) {
  const record = await RefreshToken.findById(tokenId)

  if (!record) return null
  if (record.revoked_at || new Date(record.expires_at) <= new Date()) {
    return null
  }

  return record
}

async function validateRefreshTokenRecord ({ tokenId, rawToken }) {
  const record = await findValidRefreshTokenRecord(tokenId)
  if (!record) return null

  const isMatch = await comparePassword(rawToken, record.token_hash)
  if (!isMatch) return null

  return record
}

async function revokeRefreshTokenById (tokenId, replacedByTokenId = null) {
  const now = new Date()
  await RefreshToken.findByIdAndUpdate(tokenId, {
    $set: {
      revoked_at: now,
      replaced_by_token: replacedByTokenId
    }
  })
}

async function revokeAllUserRefreshTokens (userId) {
  const now = new Date()
  await RefreshToken.updateMany(
    { user: userId, revoked_at: null },
    { $set: { revoked_at: now } }
  )
}

module.exports = {
  createRefreshTokenRecord,
  validateRefreshTokenRecord,
  revokeRefreshTokenById,
  revokeAllUserRefreshTokens
}
