const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: false }
})

module.exports = mongoose.model('Category', categorySchema)
