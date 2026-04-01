const { asyncHandler } = require('../middleware/asyncHandler')
const { createCategory, listCategories } = require('../services/categoryService')

const create = asyncHandler(async (req, res) => {
  const category = await createCategory(req.validated.body)
  return res.status(201).json(category)
})

const list = asyncHandler(async (req, res) => {
  const categories = await listCategories()
  return res.status(200).json(categories)
})

module.exports = {
  create,
  list
}
