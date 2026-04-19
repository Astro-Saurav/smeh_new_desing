const Category = require('../models/Category')
const { v4: uuidv4 } = require('uuid')
const News = require('../models/News')

async function createCategory ({ name }) {
  const category = new Category({ 
    _id: uuidv4(),
    name: name.trim() 
  })
  await category.save()
  return category
}

async function listCategories () {
  const categories = await Category.find(); return categories.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
}

async function deleteCategoryById (id) {
  const hasNews = await News.exists({ category: id })
  if (hasNews) {
    return { deleted: false, reason: 'CATEGORY_HAS_NEWS' }
  }
  const result = await Category.findByIdAndDelete(id)
  return { deleted: !!result, reason: null }
}

module.exports = {
  deleteCategoryById,
  createCategory,
  listCategories
}
