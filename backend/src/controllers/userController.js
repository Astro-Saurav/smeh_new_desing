const { asyncHandler } = require('../middleware/asyncHandler')
const { listUsers, deleteUserById } = require('../services/userService')

const list = asyncHandler(async (req, res) => {
  const users = await listUsers()
  return res.status(200).json(users)
})

const remove = asyncHandler(async (req, res) => {
  const { id } = req.validated.params

  if (id === req.user.userId) {
    return res.status(400).json({ message: 'You cannot delete your own account' })
  }

  const deletionResult = await deleteUserById(id)

  if (deletionResult.reason === 'USER_HAS_NEWS') {
    return res.status(409).json({ message: 'Cannot delete user who authored existing news' })
  }

  if (!deletionResult.deleted) {
    return res.status(404).json({ message: 'User not found' })
  }

  return res.status(204).send()
})

module.exports = {
  list,
  remove
}
