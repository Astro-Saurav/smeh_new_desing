const { asyncHandler } = require('../middleware/asyncHandler')
const { createCategory, listCategories, deleteCategoryById } = require('../services/categoryService')

const create = asyncHandler(async (req, res) => {
  const category = await createCategory(req.validated.body.name)
  return res.status(201).json(category)
})

const list = asyncHandler(async (req, res) => {
  const categories = await listCategories()
  return res.status(200).json(categories)
})

const remove = asyncHandler(async (req, res) => {
  const { id } = req.params
  const result = await deleteCategoryById(id)
  if (!result.deleted) {
    if (result.reason === 'CATEGORY_HAS_NEWS') {
      return res.status(400).json({ message: 'Cannot delete category with associated news' })
    }
    return res.status(404).json({ message: 'Category not found' })
  }
  res.status(204).end()
})

const getFeed = asyncHandler(async (req, res) => {
  const { slug } = req.params
  const { cursor, limit = 12 } = req.query

  // Need to require getCategoryFeed from newsService
  const { getCategoryFeed } = require('../services/newsService')

  const feed = await getCategoryFeed(slug, cursor, limit)
  if (!feed) {
    return res.status(404).json({ message: 'Category not found' })
  }

  return res.status(200).json(feed)
})

module.exports = {
  remove,
  create,
  list,
  getFeed
}

