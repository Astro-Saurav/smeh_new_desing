const News = require('../models/News')
const Category = require('../models/Category')
const { v4: uuidv4 } = require('uuid')

async function createNews ({ title, content, categoryId, authorId, imageUrl, youtubeUrl, status, publishedAt }) {
  const news = new News({
    _id: uuidv4(),
    title,
    content,
    category: categoryId,
    author: authorId,
    image_url: imageUrl || null,
    youtube_url: youtubeUrl || null,
    status: status || 'draft',
    published_at: publishedAt || null
  })
  await news.save()
  return getNewsById(news._id)
}

async function updateNews (id, payload) {
  const news = await News.findById(id)
  if (!news) return null

  if (payload.title !== undefined) news.title = payload.title
  if (payload.content !== undefined) news.content = payload.content
  if (payload.categoryId !== undefined) news.category = payload.categoryId
  if (payload.imageUrl !== undefined) news.image_url = payload.imageUrl
  if (payload.youtubeUrl !== undefined) news.youtube_url = payload.youtubeUrl
  if (payload.status !== undefined) news.status = payload.status
  if (payload.publishedAt !== undefined) news.published_at = payload.publishedAt
  
  news.updated_at = new Date()
  await news.save()
  
  return getNewsById(id)
}

async function deleteNews (id) {
  const result = await News.findByIdAndDelete(id)
  return !!result
}

async function getNewsById (id) {
  return News.findById(id)
    .populate('category', 'name')
    .populate('author', 'email')
}

async function listNews ({ category, search, status, page = 1, pageSize = 10 }) {
  const skip = (Number(page) - 1) * Number(pageSize)
  const filter = {}

  if (category) {
    const cat = await Category.findOne({ name: category })
    if (cat) filter.category = cat._id
  }

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } }
    ]
  }

  if (status) {
    filter.status = status
  }

  const [items, total] = await Promise.all([
    News.find(filter)
      
      .skip(skip)
      .limit(Number(pageSize))
      .populate('category', 'name')
      .populate('author', 'email'),
    News.countDocuments(filter)
  ])

  return {
    items,
    pagination: {
      page: Number(page),
      pageSize: Number(pageSize),
      total,
      totalPages: Math.ceil(total / Number(pageSize))
    }
  }
}

async function publishScheduledNews () {
  const now = new Date()
  const toPublish = await News.find({
    status: 'scheduled',
    published_at: { $lte: now }
  })

  for (const item of toPublish) {
    item.status = 'published'
    item.updated_at = now
    await item.save()
  }

  return toPublish.map(n => ({ id: n._id, title: n.title }))
}

module.exports = {
  createNews,
  updateNews,
  deleteNews,
  getNewsById,
  listNews,
  publishScheduledNews
}
