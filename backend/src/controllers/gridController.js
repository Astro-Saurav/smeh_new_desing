const { asyncHandler } = require('../middleware/asyncHandler')
const { listGrids, getGridById, createGrid, updateGrid, deleteGrid } = require('../services/gridService')
const { recordAudit } = require('../services/auditService')
const R = require('../utils/response')

const getGrids = asyncHandler(async (req, res) => {
  const grids = await listGrids()
  return R.success(res, grids, 'Grids retrieved')
})

const getGrid = asyncHandler(async (req, res) => {
  const grid = await getGridById(req.params.id)
  if (!grid) return R.notFound(res, 'Grid not found')
  return R.success(res, grid)
})

const createGridHandler = asyncHandler(async (req, res) => {
  const grid = await createGrid(req.body, req.user?.userId)

  await recordAudit({
    userId: req.user?.userId,
    action: 'grid.created',
    targetTable: 'homepage_grids',
    targetId: grid.id,
    newValue: { sectionTitle: grid.section_title, category: grid.category?.name },
    requestId: req.requestId,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent']
  })

  return R.created(res, grid, 'Grid created successfully')
})

const updateGridHandler = asyncHandler(async (req, res) => {
  try {
    const grid = await updateGrid(req.params.id, req.body, req.user?.userId)
    if (!grid) return R.notFound(res, 'Grid not found')

    await recordAudit({
      userId: req.user?.userId,
      action: 'grid.updated',
      targetTable: 'homepage_grids',
      targetId: grid.id,
      newValue: { sectionTitle: grid.section_title, layout: grid.layout_type },
      requestId: req.requestId,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    })

    return R.success(res, grid, 'Grid updated successfully')
  } catch (err) {
    if (err.message.startsWith('CONFLICT:')) {
      return R.conflict(res, err.message)
    }
    throw err
  }
})

const deleteGridHandler = asyncHandler(async (req, res) => {
  const deleted = await deleteGrid(req.params.id)
  if (!deleted) return R.notFound(res, 'Grid not found')

  await recordAudit({
    userId: req.user?.userId,
    action: 'grid.deleted',
    targetTable: 'homepage_grids',
    targetId: req.params.id,
    requestId: req.requestId,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent']
  })

  return R.noContent(res)
})

module.exports = { getGrids, getGrid, createGridHandler, updateGridHandler, deleteGridHandler }
