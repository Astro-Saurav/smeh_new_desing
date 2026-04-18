const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password_hash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'editor'],
    required: true
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: false }
})

module.exports = mongoose.model('User', userSchema)
