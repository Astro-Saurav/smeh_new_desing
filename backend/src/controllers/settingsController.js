const { asyncHandler } = require('../middleware/asyncHandler')
const { prisma } = require('../config/db')
const { recordAudit } = require('../services/auditService')
const R = require('../utils/response')

const getSettings = asyncHandler(async (req, res) => {
  const settings = await prisma.systemSetting.findMany()

  // Convert array of {key, value} to a single object
  const settingsObj = {}
  settings.forEach(s => {
    settingsObj[s.key] = s.value
  })

  return R.success(res, settingsObj)
})

const updateSettings = asyncHandler(async (req, res) => {
  const updates = req.body // Expecting object with key-value pairs

  if (!updates || typeof updates !== 'object') {
    return R.badRequest(res, 'Updates must be an object of key-value pairs')
  }

  // Use a transaction to update all provided settings
  await prisma.$transaction(
    Object.entries(updates).map(([key, value]) => {
      return prisma.systemSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) }
      })
    })
  )

  await recordAudit({
    userId: req.user?.userId || null,
    action: 'settings.updated',
    targetTable: 'system_settings',
    targetId: 'batch',
    newValue: updates,
    requestId: req.requestId,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent']
  })

  return R.success(res, null, 'Settings updated successfully')
})

module.exports = {
  getSettings,
  updateSettings
}
