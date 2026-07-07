const { prisma } = require('../config/db')
const { hashPassword, comparePassword } = require('../utils/password')

async function createRefreshTokenRecord ({ tokenId, userId, rawToken, expiresAt }) {
  const tokenHash = await hashPassword(rawToken)
  return prisma.refreshToken.create({
    data: {
      id: tokenId,
      user_id: userId,
      token_hash: tokenHash,
      expires_at: expiresAt
    }
  })
}

async function validateRefreshTokenRecord ({ tokenId, rawToken }) {
  const record = await prisma.refreshToken.findUnique({ where: { id: tokenId } })
  if (!record) return null
  if (record.revoked_at || record.expires_at <= new Date()) return null

  const isMatch = await comparePassword(rawToken, record.token_hash)
  if (!isMatch) return null

  return record
}

async function revokeRefreshTokenById (tokenId, replacedByTokenId = null) {
  await prisma.refreshToken.update({
    where: { id: tokenId },
    data: {
      revoked_at: new Date(),
      replaced_by: replacedByTokenId
    }
  })
}

async function revokeAllUserRefreshTokens (userId) {
  await prisma.refreshToken.updateMany({
    where: { user_id: userId, revoked_at: null },
    data: { revoked_at: new Date() }
  })
}

module.exports = {
  createRefreshTokenRecord,
  validateRefreshTokenRecord,
  revokeRefreshTokenById,
  revokeAllUserRefreshTokens
}
