const mongoose = require('mongoose')

const newsSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    ref: 'Category',
    required: true
  },
  author: {
    type: String,
    ref: 'User',
    required: true
  },
  image_url: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'scheduled'],
    default: 'draft'
  },
  published_at: {
    type: Date,
    default: null
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})

// Indices for performance
newsSchema.index({ status: 1, published_at: 1 })
newsSchema.index({ category: 1, created_at: -1 })

module.exports = mongoose.model('News', newsSchema)
