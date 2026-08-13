const { asyncHandler } = require('../middleware/asyncHandler')
const {
  createNews,
  updateNews,
  hardDeleteNews,
  restoreNews,
  getNewsById,
  getNewsBySlug,
  listNews,
  getNewsRevisions,
  restoreRevision,
  incrementViews
} = require('../services/newsService')
const { recordAudit } = require('../services/auditService')
const R = require('../utils/response')

const create = asyncHandler(async (req, res) => {
  const news = await createNews(req.validated.body, req.user.userId)

  await recordAudit({
    userId: req.user.userId,
    action: 'news.created',
    targetTable: 'news',
    targetId: news.id,
    newValue: { title: news.title, status: news.status },
    requestId: req.requestId,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent']
  })

  return R.created(res, news, 'Article created successfully')
})

const list = asyncHandler(async (req, res) => {
  const { category, search, status, page = 1, limit = 10, featured, visibility } = req.validated?.query || req.query

  const result = await listNews({
    category,
    search,
    status,
    page: Number(page),
    limit: Number(limit),
    isFeatured: featured === 'true' ? true : featured === 'false' ? false : undefined,
    visibility
  })

  return R.paginated(res, result.items, result.pagination, 'Articles retrieved')
})

const getById = asyncHandler(async (req, res) => {
  const news = await getNewsById(req.params.id)
  if (!news) return R.notFound(res, 'Article not found')

  if (news.status !== 'published' && (!req.user || !['admin', 'editor'].includes(req.user.role))) {
    return R.notFound(res, 'Article not found')
  }

  // Async view increment (fire and forget)
  incrementViews(news.id).catch(() => {})

  return R.success(res, news)
})

const getBySlug = asyncHandler(async (req, res) => {
  const news = await getNewsBySlug(req.params.slug)
  if (!news) return R.notFound(res, 'Article not found')

  if (news.status !== 'published' && (!req.user || !['admin', 'editor'].includes(req.user.role))) {
    return R.notFound(res, 'Article not found')
  }

  incrementViews(news.id).catch(() => {})

  return R.success(res, news)
})

const update = asyncHandler(async (req, res) => {
  const existing = await getNewsById(req.params.id)
  const news = await updateNews(req.params.id, req.validated?.body || req.body, req.user.userId)
  if (!news) return R.notFound(res, 'Article not found')

  await recordAudit({
    userId: req.user.userId,
    action: 'news.updated',
    targetTable: 'news',
    targetId: news.id,
    oldValue: existing ? { status: existing.status, title: existing.title } : undefined,
    newValue: { status: news.status, title: news.title },
    requestId: req.requestId,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent']
  })

  return R.success(res, news, 'Article updated successfully')
})

const remove = asyncHandler(async (req, res) => {
  const deleted = await hardDeleteNews(req.params.id)
  if (!deleted) return R.notFound(res, 'Article not found')

  await recordAudit({
    userId: req.user.userId,
    action: 'news.deleted',
    targetTable: 'news',
    targetId: req.params.id,
    requestId: req.requestId,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent']
  })

  return R.noContent(res)
})

const restore = asyncHandler(async (req, res) => {
  const restored = await restoreNews(req.params.id)
  if (!restored) return R.notFound(res, 'Article not found or not deleted')
  return R.success(res, null, 'Article restored to draft')
})

const getRevisions = asyncHandler(async (req, res) => {
  const revisions = await getNewsRevisions(req.params.id)
  return R.success(res, revisions, 'Revisions retrieved')
})

const restoreToRevision = asyncHandler(async (req, res) => {
  const { version } = req.params
  const news = await restoreRevision(req.params.id, version, req.user.userId)
  if (!news) return R.notFound(res, 'Revision not found')
  return R.success(res, news, `Restored to version ${version}`)
})

module.exports = {
  create,
  list,
  getById,
  getBySlug,
  update,
  remove,
  restore,
  getRevisions,
  restoreToRevision
}
