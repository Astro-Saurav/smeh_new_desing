const { prisma } = require('../config/db')
const { slugify } = require('../utils/slug')

async function listCategories () {
  return prisma.category.findMany({
    orderBy: { name: 'asc' }
  })
}

async function createCategory (name) {
  const slug = slugify(name)
  return prisma.category.create({
    data: { name: name.trim(), slug }
  })
}

async function updateCategory (id, name) {
  const existing = await prisma.category.findUnique({ where: { id } })
  if (!existing) return null

  const slug = slugify(name)
  return prisma.category.update({
    where: { id },
    data: { name: name.trim(), slug }
  })
}

async function deleteCategory (id) {
  const newsCount = await prisma.news.count({ where: { category_id: id, deleted_at: null } })
  if (newsCount > 0) return { deleted: false, reason: 'CATEGORY_HAS_NEWS' }

  await prisma.category.delete({ where: { id } })
  return { deleted: true }
}

async function findCategoryById (id) {
  return prisma.category.findUnique({ where: { id } })
}

module.exports = {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  findCategoryById
}
