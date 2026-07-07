const { prisma } = require('../config/db')
const logger = require('../utils/logger')

// ─── In-memory cache (simple, no Redis required) ──────────────────
const CACHE_KEY = 'homepage:v1'
let homepageCache = null
let cacheTimestamp = null
const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes

function isCacheValid () {
  return homepageCache !== null && cacheTimestamp !== null && (Date.now() - cacheTimestamp < CACHE_TTL_MS)
}

function invalidateHomepageCache () {
  homepageCache = null
  cacheTimestamp = null
  logger.info('Homepage cache invalidated', { key: CACHE_KEY })
}

// ─── Fields to select for homepage cards (no overfetch) ───────────
const ARTICLE_SELECT = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  content: true,       // used as fallback when excerpt is null
  published_at: true,
  youtube_url: true,
  thumbnail: {
    select: { file_path: true, path_webp: true, path_thumb: true }
  },
  category: {
    select: { id: true, name: true, slug: true }
  }
}

// ─── Fetch articles for a single grid ─────────────────────────────
async function fetchGridArticles (grid) {
  const articles = await prisma.news.findMany({
    where: {
      category_id: grid.category_id,
      status: 'published',
      deleted_at: null
    },
    select: ARTICLE_SELECT,
    orderBy: { published_at: 'desc' },
    take: grid.article_limit
  })

  // Get total count to determine hasMore
  const totalCount = await prisma.news.count({
    where: {
      category_id: grid.category_id,
      status: 'published',
      deleted_at: null
    }
  })

  return { articles, totalCount }
}

// ─── Normalize article for frontend consumption ────────────────────
function normalizeArticle (item) {
  const thumbnail = item.thumbnail
    ? (item.thumbnail.path_webp || item.thumbnail.path_thumb || item.thumbnail.file_path)
    : null

  // Fallback excerpt from content (strip HTML, truncate)
  let excerpt = item.excerpt
  if (!excerpt && item.content) {
    excerpt = item.content.replace(/<[^>]*>/g, '').trim().slice(0, 180)
    if (excerpt.length === 180) excerpt += '...'
  }

  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    excerpt: excerpt || '',
    thumbnail: thumbnail || null,
    published_at: item.published_at,
    youtube_url: item.youtube_url || null,
    category: {
      id: item.category.id,
      name: item.category.name,
      slug: item.category.slug
    }
  }
}

// ─── Main homepage service ─────────────────────────────────────────
async function buildHomepageData () {
  // Return cached response if valid
  if (isCacheValid()) {
    logger.debug('Homepage served from cache', { key: CACHE_KEY })
    return homepageCache
  }

  // Fetch all enabled PUBLIC grids ordered by display_order
  const grids = await prisma.homepageGrid.findMany({
    where: { visibility: 'PUBLIC' },
    orderBy: { display_order: 'asc' },
    include: {
      category: { select: { id: true, name: true, slug: true } }
    }
  })

  if (grids.length === 0) {
    return { homepageVersion: 1, generatedAt: new Date().toISOString(), grids: [] }
  }

  // Fire all category queries in parallel — one failure never kills the rest
  const results = await Promise.allSettled(
    grids.map((grid) => fetchGridArticles(grid))
  )

  const assembledGrids = []

  results.forEach((result, index) => {
    const grid = grids[index]

    if (result.status === 'rejected') {
      logger.error('Failed to fetch articles for homepage grid', {
        category: grid.category.name,
        gridId: grid.id,
        error: result.reason?.message
      })
      // Skip this grid — homepage still renders all others
      return
    }

    const { articles, totalCount } = result.value

    // Hide grids that returned no articles
    if (articles.length === 0) return

    assembledGrids.push({
      id: grid.id,
      category: grid.category.name,
      categorySlug: grid.category.slug,
      layout: grid.layout_type,
      title: grid.section_title,
      articleLimit: grid.article_limit,
      featuredLimit: grid.featured_limit,
      showViewAll: grid.show_view_all,
      articleCount: totalCount,
      hasMore: totalCount > articles.length,
      articles: articles.map(normalizeArticle)
    })
  })

  const payload = {
    homepageVersion: 1,
    generatedAt: new Date().toISOString(),
    grids: assembledGrids
  }

  // Cache the result
  homepageCache = payload
  cacheTimestamp = Date.now()
  logger.info('Homepage cache refreshed', { key: CACHE_KEY, gridCount: assembledGrids.length })

  return payload
}

module.exports = {
  buildHomepageData,
  invalidateHomepageCache
}
