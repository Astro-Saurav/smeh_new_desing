const { prisma } = require('../config/db')
const { hashPassword } = require('../utils/password')

async function findUserByEmail (email) {
  return prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    include: { role: true }
  })
}

async function findUserById (id) {
  return prisma.user.findUnique({
    where: { id },
    include: { role: true }
  })
}

async function createUser ({ email, password, roleName = 'editor' }) {
  const passwordHash = await hashPassword(password)

  // Resolve role by name, create if it doesn't exist (dev convenience)
  let role = await prisma.role.findUnique({ where: { name: roleName } })
  if (!role) {
    role = await prisma.role.create({ data: { name: roleName } })
  }

  return prisma.user.create({
    data: {
      email: email.toLowerCase(),
      password_hash: passwordHash,
      role_id: role.id
    },
    include: { role: true }
  })
}

async function listUsers () {
  return prisma.user.findMany({
    where: { deleted_at: null },
    select: {
      id: true,
      email: true,
      role: { select: { name: true } },
      is_2fa_enabled: true,
      created_at: true,
      updated_at: true
    },
    orderBy: { created_at: 'desc' }
  })
}

async function softDeleteUser (id) {
  // Check for authored news
  const newsCount = await prisma.news.count({ where: { created_by: id, deleted_at: null } })
  if (newsCount > 0) {
    return { deleted: false, reason: 'USER_HAS_NEWS' }
  }

  await prisma.user.update({
    where: { id },
    data: { deleted_at: new Date() }
  })
  return { deleted: true, reason: null }
}

async function updateUserPassword (id, newPassword) {
  const passwordHash = await hashPassword(newPassword)
  return prisma.user.update({
    where: { id },
    data: { password_hash: passwordHash, password_changed_at: new Date() }
  })
}

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  listUsers,
  softDeleteUser,
  updateUserPassword
}
