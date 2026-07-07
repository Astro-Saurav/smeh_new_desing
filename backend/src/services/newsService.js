const { prisma } = require('../config/db')
const { slugify } = require('../utils/slug')
const { invalidateHomepageCache } = require('./homepageService')
const { deleteMediaFiles } = require('./uploadService')

const NEWS_SELECT = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  content: true,
  youtube_url: true,
  status: true,
  visibility: true,
  is_featured: true,
  is_pinned: true,
  featured_order: true,
  allow_comments: true,
  language: true,
  publish_version: true,
  views_count: true,
  likes_count: true,
  shares_count: true,
  reading_time: true,
  seo_title: true,
  seo_description: true,
  meta_keywords: true,
  canonical_url: true,
  scheduled_publish_at: true,
  published_at: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
  category: { select: { id: true, name: true, slug: true } },
  author: { select: { id: true, email: true, role: { select: { name: true } } } },
  thumbnail: { select: { id: true, file_path: true, path_webp: true, path_avif: true, path_thumb: true } },
  document: { select: { id: true, file_path: true, original_name: true, mime_type: true } },
  tags: { include: { tag: { select: { id: true, name: true, slug: true } } } }
}

async function createNews (payload, authorId) {
  const slug = await ensureUniqueSlug(slugify(payload.title))

  const data = {
    title: payload.title,
    slug,
    excerpt: payload.excerpt || null,
    content: payload.content,
    youtube_url: payload.youtubeUrl || null,
    category_id: payload.categoryId,
    created_by: authorId,
    status: payload.status || 'draft',
    visibility: payload.visibility || 'public',
    is_featured: !!payload.isFeatured,
    is_pinned: !!payload.isPinned,
    allow_comments: payload.allowComments !== false,
    language: payload.language || 'en',
    seo_title: payload.seoTitle || null,
    seo_description: payload.seoDescription || null,
    meta_keywords: payload.metaKeywords || null,
    canonical_url: payload.canonicalUrl || null,
    thumbnail_media_id: payload.thumbnailMediaId || null,
    document_media_id: payload.documentMediaId || null,
    reading_time: payload.readingTime ? Number(payload.readingTime) : estimateReadingTime(payload.content),
    published_at: payload.status === 'published' ? new Date() : null,
    scheduled_publish_at: payload.scheduledPublishAt ? new Date(payload.scheduledPublishAt) : null
  }

  const news = await prisma.news.create({ data, select: NEWS_SELECT })

  // Seed first revision
  await prisma.newsRevision.create({
    data: {
      news_id: news.id,
      version_number: 1,
      title: news.title,
      excerpt: news.excerpt,
      content: news.content,
      editor_id: authorId
    }
  })

  invalidateHomepageCache()
  return news
}

async function updateNews (id, payload, editorId) {
  const existing = await prisma.news.findUnique({ where: { id, deleted_at: null } })
  if (!existing) return null

  const updateData = {}
  if (payload.title !== undefined) {
    updateData.title = payload.title
    updateData.slug = await ensureUniqueSlug(slugify(payload.title), id)
  }
  if (payload.excerpt !== undefined) updateData.excerpt = payload.excerpt
  if (payload.content !== undefined) {
    updateData.content = payload.content
    updateData.reading_time = estimateReadingTime(payload.content)
  }
  if (payload.categoryId !== undefined) updateData.category_id = payload.categoryId
  if (payload.youtubeUrl !== undefined) updateData.youtube_url = payload.youtubeUrl
  if (payload.status !== undefined) {
    updateData.status = payload.status
    if (payload.status === 'published' && !existing.published_at) {
      updateData.published_at = new Date()
    }
  }
  if (payload.isFeatured !== undefined) updateData.is_featured = payload.isFeatured
  if (payload.isPinned !== undefined) updateData.is_pinned = payload.isPinned
  if (payload.thumbnailMediaId !== undefined) updateData.thumbnail_media_id = payload.thumbnailMediaId
  if (payload.documentMediaId !== undefined) updateData.document_media_id = payload.documentMediaId
  if (payload.seoTitle !== undefined) updateData.seo_title = payload.seoTitle
  if (payload.seoDescription !== undefined) updateData.seo_description = payload.seoDescription
  if (payload.scheduledPublishAt !== undefined) {
    updateData.scheduled_publish_at = payload.scheduledPublishAt ? new Date(payload.scheduledPublishAt) : null
  }
  if (payload.visibility !== undefined) updateData.visibility = payload.visibility

  updateData.updated_by = editorId
  updateData.publish_version = { increment: 1 }

  const updated = await prisma.news.update({
    where: { id },
    data: updateData,
    select: NEWS_SELECT
  })

  // Save a new revision
  await prisma.newsRevision.create({
    data: {
      news_id: id,
      version_number: updated.publish_version,
      title: updated.title,
      excerpt: updated.excerpt,
      content: updated.content,
      editor_id: editorId
    }
  })

  invalidateHomepageCache()
  return updated
}

async function softDeleteNews (id) {
  const news = await prisma.news.findUnique({ where: { id, deleted_at: null } })
  if (!news) return false

  await prisma.news.update({
    where: { id },
    data: { deleted_at: new Date(), status: 'archived' }
  })
  invalidateHomepageCache()
  return true
}

async function hardDeleteNews (id) {
  const news = await prisma.news.findUnique({ 
    where: { id },
    include: { images: true } 
  })
  
  if (!news) return false

  // Gather all associated media IDs
  const mediaIds = new Set()
  if (news.thumbnail_media_id) mediaIds.add(news.thumbnail_media_id)
  if (news.seo_image_media_id) mediaIds.add(news.seo_image_media_id)
  if (news.document_media_id) mediaIds.add(news.document_media_id)
  news.images.forEach(img => mediaIds.add(img.media_id))

  // Delete physical files and media records
  for (const mediaId of mediaIds) {
    await deleteMediaFiles(mediaId)
  }

  // Delete the news record (this cascades to NewsImage, NewsTag, NewsRevision due to schema)
  await prisma.news.delete({ where: { id } })
  
  invalidateHomepageCache()
  return true
}

async function restoreNews (id) {
  const news = await prisma.news.findUnique({ where: { id } })
  if (!news || !news.deleted_at) return false

  await prisma.news.update({
    where: { id },
    data: { deleted_at: null, status: 'draft' }
  })
  return true
}

async function getNewsById (id, includeDeleted = false) {
  const where = includeDeleted ? { id } : { id, deleted_at: null }
  return prisma.news.findUnique({ where, select: NEWS_SELECT })
}

async function getNewsBySlug (slug) {
  return prisma.news.findUnique({
    where: { slug, deleted_at: null },
    select: NEWS_SELECT
  })
}

async function listNews ({ category, search, status, page = 1, limit = 10, isFeatured, visibility, includeDeleted = false }) {
  const skip = (Number(page) - 1) * Number(limit)
  const where = {}

  if (!includeDeleted) where.deleted_at = null
  if (status) where.status = status
  if (visibility) where.visibility = visibility
  if (isFeatured !== undefined) where.is_featured = isFeatured

  if (category) {
    where.category = {
      OR: [{ slug: category }, { name: { equals: category } }]
    }
  }

  if (search) {
    where.OR = [
      { title: { contains: search } },
      { excerpt: { contains: search } },
      { content: { contains: search } }
    ]
  }

  const [items, total] = await Promise.all([
    prisma.news.findMany({
      where,
      select: NEWS_SELECT,
      orderBy: { created_at: 'desc' },
      skip,
      take: Number(limit)
    }),
    prisma.news.count({ where })
  ])

  return {
    items,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit))
    }
  }
}

async function getNewsRevisions (newsId) {
  return prisma.newsRevision.findMany({
    where: { news_id: newsId },
    include: { editor: { select: { id: true, email: true } } },
    orderBy: { version_number: 'desc' }
  })
}

async function restoreRevision (newsId, versionNumber, editorId) {
  const revision = await prisma.newsRevision.findUnique({
    where: { news_id_version_number: { news_id: newsId, version_number: Number(versionNumber) } }
  })
  if (!revision) return null

  return updateNews(newsId, {
    title: revision.title,
    excerpt: revision.excerpt,
    content: revision.content
  }, editorId)
}

async function incrementViews (id) {
  return prisma.news.update({
    where: { id },
    data: { views_count: { increment: 1 } }
  })
}

// ─── Helpers ─────────────────────────────────────────────

function estimateReadingTime (content) {
  const words = content ? content.replace(/<[^>]*>/g, '').split(/\s+/).length : 0
  return Math.max(1, Math.round(words / 200))
}

async function ensureUniqueSlug (baseSlug, excludeId = null) {
  let slug = baseSlug
  let counter = 1

  while (true) {
    const where = { slug }
    const existing = await prisma.news.findUnique({ where })
    if (!existing || existing.id === excludeId) return slug
    slug = `${baseSlug}-${counter++}`
  }
}

async function getCategoryFeed(slug, cursor, limit = 12) {
  const category = await prisma.category.findUnique({ where: { slug } })
  if (!category) return null

  const where = { category_id: category.id, status: 'published', deleted_at: null }
  
  // Base query args
  const args = {
    where,
    select: NEWS_SELECT,
    orderBy: [{ created_at: 'desc' }, { id: 'desc' }]
  }

  // If initial load (no cursor), fetch enough to fill top sections + limit for older
  // Top sections take 9 items (1 hero + 2 secondary + 6 sidebar)
  const TOP_SECTION_COUNT = 9
  const takeCount = cursor ? Number(limit) + 1 : TOP_SECTION_COUNT + Number(limit) + 1

  args.take = takeCount

  if (cursor) {
    args.cursor = { id: cursor }
    args.skip = 1 // skip the cursor itself
  }

  const items = await prisma.news.findMany(args)

  let hasMore = false
  if (items.length === takeCount) {
    hasMore = true
    items.pop() // remove the extra item used for checking hasMore
  }

  let nextCursor = null
  if (items.length > 0) {
    nextCursor = items[items.length - 1].id
  }

  if (cursor) {
    // If loading more, all items go to 'older'
    return {
      category: { name: category.name, slug: category.slug },
      hero: [],
      secondary: [],
      sidebar: [],
      older: items,
      pagination: { cursor: nextCursor, hasMore }
    }
  }

  // Initial load: Distribute items
  const hero = items.slice(0, 1)
  const secondary = items.slice(1, 3)
  const sidebar = items.slice(3, 9)
  const older = items.slice(9)

  return {
    category: { name: category.name, slug: category.slug },
    hero,
    secondary,
    sidebar,
    older,
    pagination: { cursor: nextCursor, hasMore }
  }
}

module.exports = {
  createNews,
  updateNews,
  softDeleteNews,
  hardDeleteNews,
  restoreNews,
  getNewsById,
  getNewsBySlug,
  listNews,
  getNewsRevisions,
  restoreRevision,
  incrementViews,
  getCategoryFeed
}

