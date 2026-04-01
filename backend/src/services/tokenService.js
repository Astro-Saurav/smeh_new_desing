const { v4: uuidv4 } = require('uuid')
const { getPool, sql } = require('../config/db')
const { hashPassword, comparePassword } = require('../utils/password')

async function createRefreshTokenRecord ({ tokenId, userId, rawToken, expiresAt }) {
  const pool = await getPool()
  const finalTokenId = tokenId || uuidv4()
  const tokenHash = await hashPassword(rawToken)

  await pool
    .request()
    .input('id', sql.UniqueIdentifier, finalTokenId)
    .input('user_id', sql.UniqueIdentifier, userId)
    .input('token_hash', sql.NVarChar(255), tokenHash)
    .input('expires_at', sql.DateTime2, expiresAt)
    .query(`
      INSERT INTO refresh_tokens (id, user_id, token_hash, expires_at)
      VALUES (@id, @user_id, @token_hash, @expires_at)
    `)

  return finalTokenId
}

async function findValidRefreshTokenRecord (tokenId) {
  const pool = await getPool()
  const result = await pool
    .request()
    .input('id', sql.UniqueIdentifier, tokenId)
    .query(`
      SELECT id, user_id, token_hash, expires_at, revoked_at
      FROM refresh_tokens
      WHERE id = @id
    `)

  const record = result.recordset[0]

  if (!record) {
    return null
  }

  if (record.revoked_at || new Date(record.expires_at) <= new Date()) {
    return null
  }

  return record
}

async function validateRefreshTokenRecord ({ tokenId, rawToken }) {
  const record = await findValidRefreshTokenRecord(tokenId)

  if (!record) {
    return null
  }

  const isMatch = await comparePassword(rawToken, record.token_hash)

  if (!isMatch) {
    return null
  }

  return record
}

async function revokeRefreshTokenById (tokenId, replacedByTokenId = null) {
  const pool = await getPool()

  await pool
    .request()
    .input('id', sql.UniqueIdentifier, tokenId)
    .input('replaced_by_token_id', sql.UniqueIdentifier, replacedByTokenId)
    .query(`
      UPDATE refresh_tokens
      SET
        revoked_at = ISNULL(revoked_at, SYSUTCDATETIME()),
        replaced_by_token_id = @replaced_by_token_id
      WHERE id = @id
    `)
}

async function revokeAllUserRefreshTokens (userId) {
  const pool = await getPool()

  await pool
    .request()
    .input('user_id', sql.UniqueIdentifier, userId)
    .query(`
      UPDATE refresh_tokens
      SET revoked_at = ISNULL(revoked_at, SYSUTCDATETIME())
      WHERE user_id = @user_id AND revoked_at IS NULL
    `)
}

module.exports = {
  createRefreshTokenRecord,
  validateRefreshTokenRecord,
  revokeRefreshTokenById,
  revokeAllUserRefreshTokens
}
