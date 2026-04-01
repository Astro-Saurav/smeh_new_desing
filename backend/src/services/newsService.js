const { v4: uuidv4 } = require('uuid')
const { getPool, sql } = require('../config/db')

async function createNews ({ title, content, categoryId, authorId, imageUrl, status, publishedAt }) {
  const pool = await getPool()
  const id = uuidv4()

  await pool
    .request()
    .input('id', sql.UniqueIdentifier, id)
    .input('title', sql.NVarChar(300), title)
    .input('content', sql.NVarChar(sql.MAX), content)
    .input('category_id', sql.Int, categoryId)
    .input('author_id', sql.UniqueIdentifier, authorId)
    .input('image_url', sql.NVarChar(2048), imageUrl || null)
    .input('status', sql.NVarChar(20), status)
    .input('published_at', sql.DateTime2, publishedAt || null)
    .query(`
      INSERT INTO news (id, title, content, category_id, author_id, image_url, status, published_at)
      OUTPUT INSERTED.*
      VALUES (@id, @title, @content, @category_id, @author_id, @image_url, @status, @published_at)
    `)

  return getNewsById(id)
}

async function updateNews (id, payload) {
  const pool = await getPool()
  const current = await getNewsById(id)

  if (!current) {
    return null
  }

  const nextData = {
    title: payload.title ?? current.title,
    content: payload.content ?? current.content,
    categoryId: payload.categoryId ?? current.category_id,
    imageUrl: payload.imageUrl !== undefined ? payload.imageUrl : current.image_url,
    status: payload.status ?? current.status,
    publishedAt: payload.publishedAt !== undefined ? payload.publishedAt : current.published_at
  }

  await pool
    .request()
    .input('id', sql.UniqueIdentifier, id)
    .input('title', sql.NVarChar(300), nextData.title)
    .input('content', sql.NVarChar(sql.MAX), nextData.content)
    .input('category_id', sql.Int, nextData.categoryId)
    .input('image_url', sql.NVarChar(2048), nextData.imageUrl)
    .input('status', sql.NVarChar(20), nextData.status)
    .input('published_at', sql.DateTime2, nextData.publishedAt)
    .query(`
      UPDATE news
      SET
        title = @title,
        content = @content,
        category_id = @category_id,
        image_url = @image_url,
        status = @status,
        published_at = @published_at,
        updated_at = SYSUTCDATETIME()
      WHERE id = @id
    `)

  return getNewsById(id)
}

async function deleteNews (id) {
  const pool = await getPool()
  const result = await pool
    .request()
    .input('id', sql.UniqueIdentifier, id)
    .query('DELETE FROM news WHERE id = @id')

  return result.rowsAffected[0] > 0
}

async function getNewsById (id) {
  const pool = await getPool()
  const result = await pool
    .request()
    .input('id', sql.UniqueIdentifier, id)
    .query(`
      SELECT
        n.id,
        n.title,
        n.content,
        n.category_id,
        c.name AS category_name,
        n.author_id,
        u.email AS author_email,
        n.image_url,
        n.status,
        n.published_at,
        n.created_at,
        n.updated_at
      FROM news n
      INNER JOIN categories c ON c.id = n.category_id
      INNER JOIN users u ON u.id = n.author_id
      WHERE n.id = @id
    `)

  return result.recordset[0] || null
}

async function listNews ({ category, search, status, page = 1, pageSize = 10 }) {
  const pool = await getPool()
  const offset = (page - 1) * pageSize

  const filterParts = []
  const request = pool.request()

  if (category) {
    filterParts.push('c.name = @category')
    request.input('category', sql.NVarChar(120), category)
  }

  if (search) {
    filterParts.push('(n.title LIKE @search OR n.content LIKE @search)')
    request.input('search', sql.NVarChar(400), `%${search}%`)
  }

  if (status) {
    filterParts.push('n.status = @status')
    request.input('status', sql.NVarChar(20), status)
  }

  const whereClause = filterParts.length ? `WHERE ${filterParts.join(' AND ')}` : ''

  request
    .input('offset', sql.Int, offset)
    .input('pageSize', sql.Int, pageSize)

  const result = await request.query(`
    SELECT
      n.id,
      n.title,
      n.content,
      n.category_id,
      c.name AS category_name,
      n.author_id,
      u.email AS author_email,
      n.image_url,
      n.status,
      n.published_at,
      n.created_at,
      n.updated_at,
      COUNT(*) OVER() AS total_count
    FROM news n
    INNER JOIN categories c ON c.id = n.category_id
    INNER JOIN users u ON u.id = n.author_id
    ${whereClause}
    ORDER BY n.created_at DESC
    OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY
  `)

  const total = result.recordset[0] ? Number(result.recordset[0].total_count) : 0

  return {
    items: result.recordset.map((item) => {
      const { total_count: totalCount, ...rest } = item
      return rest
    }),
    pagination: {
      page,
      pageSize,
      total,
      totalPages: total > 0 ? Math.ceil(total / pageSize) : 0
    }
  }
}

async function publishScheduledNews () {
  const pool = await getPool()
  const result = await pool
    .request()
    .query(`
      UPDATE news
      SET
        status = 'published',
        updated_at = SYSUTCDATETIME()
      OUTPUT INSERTED.id, INSERTED.title
      WHERE status = 'scheduled' AND published_at <= SYSUTCDATETIME()
    `)

  return result.recordset
}

module.exports = {
  createNews,
  updateNews,
  deleteNews,
  getNewsById,
  listNews,
  publishScheduledNews
}
