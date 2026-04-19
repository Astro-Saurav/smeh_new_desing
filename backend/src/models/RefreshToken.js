const mongoose = require('mongoose')

const refreshTokenSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  user: {
    type: String,
    ref: 'User',
    required: true
  },
  token_hash: {
    type: String,
    required: true
  },
  expires_at: {
    type: Date,
    required: true
  },
  revoked_at: {
    type: Date,
    default: null
  },
  replaced_by_token: {
    type: String,
    default: null
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: false }
})

module.exports = mongoose.model('RefreshToken', refreshTokenSchema)
