const Category = require('../models/Category')
const { v4: uuidv4 } = require('uuid')

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

module.exports = {
  createCategory,
  listCategories
}
