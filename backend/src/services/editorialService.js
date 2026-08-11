const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const listEditorialRoles = async () => {
  return prisma.editorialRole.findMany({
    include: {
      members: {
        orderBy: {
          display_order: 'asc'
        }
      }
    },
    orderBy: {
      display_order: 'asc'
    }
  })
}

const createEditorialRole = async (data) => {
  return prisma.editorialRole.create({
    data
  })
}

const updateEditorialRole = async (id, data) => {
  return prisma.editorialRole.update({
    where: { id },
    data
  })
}

const deleteEditorialRole = async (id) => {
  try {
    await prisma.editorialRole.delete({
      where: { id }
    })
    return { deleted: true }
  } catch (error) {
    return { deleted: false, reason: 'NOT_FOUND' }
  }
}

const createEditorialMember = async (data) => {
  return prisma.editorialMember.create({
    data
  })
}

const updateEditorialMember = async (id, data) => {
  return prisma.editorialMember.update({
    where: { id },
    data
  })
}

const deleteEditorialMember = async (id) => {
  try {
    await prisma.editorialMember.delete({
      where: { id }
    })
    return { deleted: true }
  } catch (error) {
    return { deleted: false, reason: 'NOT_FOUND' }
  }
}

module.exports = {
  listEditorialRoles,
  createEditorialRole,
  updateEditorialRole,
  deleteEditorialRole,
  createEditorialMember,
  updateEditorialMember,
  deleteEditorialMember
}
