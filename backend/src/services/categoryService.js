const Category = require('../models/Category')

async function createCategory ({ name }) {
  const category = new Category({ name: name.trim() })
  await category.save()
  return category
}

async function listCategories () {
  return Category.find().sort({ name: 1 })
}

module.exports = {
  createCategory,
  listCategories
}

