const { asyncHandler } = require('../middleware/asyncHandler')
const { buildHomepageData } = require('../services/homepageService')
const R = require('../utils/response')

/**
 * GET /api/v1/homepage
 * Returns the fully assembled homepage payload with all enabled grids and their articles.
 */
const getHomepage = asyncHandler(async (req, res) => {
  const payload = await buildHomepageData()
  return R.success(res, payload, 'Homepage data retrieved')
})

module.exports = { getHomepage }
