const { v4: uuidv4 } = require('uuid')
const { getPool, sql } = require('../config/db')
const { hashPassword } = require('../utils/password')

async function findUserByEmail (email) {
  const pool = await getPool()
  const result = await pool
    .request()
    .input('email', sql.NVarChar(255), email)
    .query(`
      SELECT id, email, password_hash, role, created_at
      FROM users
      WHERE email = @email
    `)

  return result.recordset[0] || null
}

async function findUserById (id) {
  const pool = await getPool()
  const result = await pool
    .request()
    .input('id', sql.UniqueIdentifier, id)
    .query(`
      SELECT id, email, role, created_at
      FROM users
      WHERE id = @id
    `)

  return result.recordset[0] || null
}

async function createUser ({ email, password, role }) {
  const pool = await getPool()
  const id = uuidv4()
  const passwordHash = await hashPassword(password)

  await pool
    .request()
    .input('id', sql.UniqueIdentifier, id)
    .input('email', sql.NVarChar(255), email)
    .input('password_hash', sql.NVarChar(255), passwordHash)
    .input('role', sql.NVarChar(20), role)
    .query(`
      INSERT INTO users (id, email, password_hash, role)
      VALUES (@id, @email, @password_hash, @role)
    `)

  return findUserById(id)
}

async function listUsers () {
  const pool = await getPool()
  const result = await pool
    .request()
    .query(`
      SELECT id, email, role, created_at
      FROM users
      ORDER BY created_at DESC
    `)

  return result.recordset
}

async function deleteUserById (id) {
  const pool = await getPool()

  const hasNewsResult = await pool
    .request()
    .input('author_id', sql.UniqueIdentifier, id)
    .query('SELECT COUNT(*) AS total FROM news WHERE author_id = @author_id')

  if (Number(hasNewsResult.recordset[0].total) > 0) {
    return {
      deleted: false,
      reason: 'USER_HAS_NEWS'
    }
  }

  const result = await pool
    .request()
    .input('id', sql.UniqueIdentifier, id)
    .query('DELETE FROM users WHERE id = @id')

  return {
    deleted: result.rowsAffected[0] > 0,
    reason: null
  }
}

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  listUsers,
  deleteUserById
}
