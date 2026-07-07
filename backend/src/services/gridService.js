const { prisma } = require('../config/db')
const { invalidateHomepageCache } = require('./homepageService')
const logger = require('../utils/logger')

// ─── List all grids (ordered) ──────────────────────────────────────
async function listGrids () {
  return prisma.homepageGrid.findMany({
    orderBy: { display_order: 'asc' },
    include: {
      category: { select: { id: true, name: true, slug: true } }
    }
  })
}

// ─── Get single grid ───────────────────────────────────────────────
async function getGridById (id) {
  return prisma.homepageGrid.findUnique({
    where: { id },
    include: { category: { select: { id: true, name: true, slug: true } } }
  })
}

// ─── Create grid (with automatic order normalization) ─────────────
async function createGrid (payload, editorId) {
  const {
    categoryId,
    sectionTitle,
    displayOrder,
    layoutType = 'FEATURED',
    articleLimit = 10,
    featuredLimit = 1,
    visibility = 'PUBLIC',
    showViewAll = true
  } = payload

  const grid = await prisma.$transaction(async (tx) => {
    // Shift every grid with order >= displayOrder up by 1 to make room
    await tx.homepageGrid.updateMany({
      where: { display_order: { gte: displayOrder } },
      data: { display_order: { increment: 1 } }
    })

    return tx.homepageGrid.create({
      data: {
        category_id: categoryId,
        section_title: sectionTitle,
        display_order: displayOrder,
        layout_type: layoutType,
        article_limit: articleLimit,
        featured_limit: featuredLimit,
        visibility,
        show_view_all: showViewAll,
        updated_by: editorId || null
      },
      include: { category: { select: { id: true, name: true, slug: true } } }
    })
  })

  invalidateHomepageCache()
  logger.info('Homepage grid created', { gridId: grid.id, category: grid.category?.name })
  return grid
}

// ─── Update grid (with optimistic locking) ────────────────────────
async function updateGrid (id, payload, editorId) {
  const { updatedAt, ...fields } = payload

  // Optimistic locking: reject stale writes
  const existing = await prisma.homepageGrid.findUnique({ where: { id } })
  if (!existing) return null
  if (updatedAt && new Date(updatedAt).getTime() !== existing.updated_at.getTime()) {
    throw new Error('CONFLICT: Grid was modified by another user. Please reload and try again.')
  }

  const updateData = {}
  if (fields.sectionTitle !== undefined) updateData.section_title = fields.sectionTitle
  if (fields.layoutType !== undefined) updateData.layout_type = fields.layoutType
  if (fields.articleLimit !== undefined) updateData.article_limit = fields.articleLimit
  if (fields.featuredLimit !== undefined) updateData.featured_limit = fields.featuredLimit
  if (fields.visibility !== undefined) updateData.visibility = fields.visibility
  if (fields.showViewAll !== undefined) updateData.show_view_all = fields.showViewAll
  if (editorId) updateData.updated_by = editorId

  // If display_order is changing, normalize via transaction
  if (fields.displayOrder !== undefined && fields.displayOrder !== existing.display_order) {
    const updated = await prisma.$transaction(async (tx) => {
      const oldOrder = existing.display_order
      const newOrder = fields.displayOrder

      if (newOrder > oldOrder) {
        // Moving down: shift others up in the range
        await tx.homepageGrid.updateMany({
          where: {
            id: { not: id },
            display_order: { gt: oldOrder, lte: newOrder }
          },
          data: { display_order: { decrement: 1 } }
        })
      } else {
        // Moving up: shift others down in the range
        await tx.homepageGrid.updateMany({
          where: {
            id: { not: id },
            display_order: { gte: newOrder, lt: oldOrder }
          },
          data: { display_order: { increment: 1 } }
        })
      }

      return tx.homepageGrid.update({
        where: { id },
        data: { ...updateData, display_order: newOrder },
        include: { category: { select: { id: true, name: true, slug: true } } }
      })
    })

    invalidateHomepageCache()
    logger.info('Homepage grid updated with order change', { gridId: id })
    return updated
  }

  const updated = await prisma.homepageGrid.update({
    where: { id },
    data: updateData,
    include: { category: { select: { id: true, name: true, slug: true } } }
  })

  invalidateHomepageCache()
  logger.info('Homepage grid updated', { gridId: id })
  return updated
}

// ─── Delete grid ───────────────────────────────────────────────────
async function deleteGrid (id) {
  const existing = await prisma.homepageGrid.findUnique({ where: { id } })
  if (!existing) return false

  await prisma.$transaction(async (tx) => {
    await tx.homepageGrid.delete({ where: { id } })

    // Re-normalize display_order for remaining grids
    const remaining = await tx.homepageGrid.findMany({
      orderBy: { display_order: 'asc' }
    })

    for (let i = 0; i < remaining.length; i++) {
      if (remaining[i].display_order !== i + 1) {
        await tx.homepageGrid.update({
          where: { id: remaining[i].id },
          data: { display_order: i + 1 }
        })
      }
    }
  })

  invalidateHomepageCache()
  logger.info('Homepage grid deleted and orders normalized', { gridId: id })
  return true
}

module.exports = { listGrids, getGridById, createGrid, updateGrid, deleteGrid }
