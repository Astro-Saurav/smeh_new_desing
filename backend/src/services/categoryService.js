const { getPool, sql } = require('../config/db')

async function createCategory ({ name }) {
  const pool = await getPool()

  const result = await pool
    .request()
    .input('name', sql.NVarChar(120), name.trim())
    .query(`
      INSERT INTO categories (name)
      OUTPUT INSERTED.id, INSERTED.name, INSERTED.created_at
      VALUES (@name)
    `)

  return result.recordset[0]
}

async function listCategories () {
  const pool = await getPool()

  const result = await pool
    .request()
    .query(`
      SELECT id, name, created_at
      FROM categories
      ORDER BY name ASC
    `)

  return result.recordset
}

module.exports = {
  createCategory,
  listCategories
}
