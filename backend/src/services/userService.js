const User = require('../models/User')
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
    email,
    password_hash: passwordHash,
    role
  })
  await user.save()
  return user
}

async function listUsers () {
  return User.find().sort({ created_at: -1 }).select('-password_hash')
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
