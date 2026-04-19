const User = require('../models/User')
const { v4: uuidv4 } = require('uuid')
const { hashPassword } = require('../utils/password')
const News = require('../models/News')

async function findUserByEmail (email) {
  return User.findOne({ email })
}

async function findUserById (id) {
  return User.findById(id)
}

async function createUser ({ email, password, role }) {
  const passwordHash = await hashPassword(password)
  const user = new User({
    _id: uuidv4(),
    email,
    password_hash: passwordHash,
    role
  })
  await user.save()
  return user
}

async function listUsers () {
  const users = await User.find().select('-password_hash'); return users.sort((a, b) => (new Date(b.created_at) - new Date(a.created_at)));
}

async function deleteUserById (id) {
  const hasNews = await News.exists({ author: id })

  if (hasNews) {
    return {
      deleted: false,
      reason: 'USER_HAS_NEWS'
    }
  }

  const result = await User.findByIdAndDelete(id)

  return {
    deleted: !!result,
    reason: null
  }
}

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  listUsers,
  deleteUserById
}
