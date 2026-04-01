const { asyncHandler } = require('../middleware/asyncHandler')
const {
  createNews,
  updateNews,
  deleteNews,
  getNewsById,
  listNews
} = require('../services/newsService')

function normalizePublishedAt (status, publishedAt) {
  if (status === 'published' && !publishedAt) {
    return new Date().toISOString()
  }

  if (status === 'draft') {
    return null
  }

  return publishedAt || null
}

const create = asyncHandler(async (req, res) => {
  const payload = req.validated.body

  const news = await createNews({
    title: payload.title,
    content: payload.content,
    categoryId: payload.categoryId,
    authorId: req.user.userId,
    imageUrl: payload.imageUrl,
    status: payload.status,
    publishedAt: normalizePublishedAt(payload.status, payload.publishedAt)
  })

  return res.status(201).json(news)
})

const list = asyncHandler(async (req, res) => {
  const { category, search, status, page = 1, pageSize = 10 } = req.validated.query

  const data = await listNews({
    category,
    search,
    status,
    page,
    pageSize
  })

  return res.status(200).json(data)
})

const getById = asyncHandler(async (req, res) => {
  const news = await getNewsById(req.validated.params.id)

  if (!news) {
    return res.status(404).json({ message: 'News not found' })
  }

  return res.status(200).json(news)
})

const update = asyncHandler(async (req, res) => {
  const payload = req.validated.body

  if (payload.status) {
    payload.publishedAt = normalizePublishedAt(payload.status, payload.publishedAt)
  }

  const news = await updateNews(req.validated.params.id, payload)

  if (!news) {
    return res.status(404).json({ message: 'News not found' })
  }

  return res.status(200).json(news)
})

const remove = asyncHandler(async (req, res) => {
  const isDeleted = await deleteNews(req.validated.params.id)

  if (!isDeleted) {
    return res.status(404).json({ message: 'News not found' })
  }

  return res.status(204).send()
})

module.exports = {
  create,
  list,
  getById,
  update,
  remove
}
