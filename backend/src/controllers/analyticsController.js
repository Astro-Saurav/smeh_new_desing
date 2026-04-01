const { asyncHandler } = require('../middleware/asyncHandler')
const { getOverviewAnalytics } = require('../services/analyticsService')

const overview = asyncHandler(async (req, res) => {
  const data = await getOverviewAnalytics()
  return res.status(200).json(data)
})

module.exports = {
  overview
}
