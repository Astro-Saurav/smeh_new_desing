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
  return Category.find().sort({ name: 1 })
}

module.exports = {
  createCategory,
  listCategories
}
