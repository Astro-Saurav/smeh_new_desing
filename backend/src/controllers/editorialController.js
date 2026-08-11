const { asyncHandler } = require('../middleware/asyncHandler')
const editorialService = require('../services/editorialService')

const listRoles = asyncHandler(async (req, res) => {
  const roles = await editorialService.listEditorialRoles()
  return res.status(200).json(roles)
})

const createRole = asyncHandler(async (req, res) => {
  const role = await editorialService.createEditorialRole(req.validated.body)
  return res.status(201).json(role)
})

const updateRole = asyncHandler(async (req, res) => {
  const { id } = req.params
  const role = await editorialService.updateEditorialRole(id, req.validated.body)
  return res.status(200).json(role)
})

const deleteRole = asyncHandler(async (req, res) => {
  const { id } = req.params
  const result = await editorialService.deleteEditorialRole(id)
  if (!result.deleted) {
    return res.status(404).json({ message: 'Role not found' })
  }
  res.status(204).end()
})

const createMember = asyncHandler(async (req, res) => {
  const member = await editorialService.createEditorialMember(req.validated.body)
  return res.status(201).json(member)
})

const updateMember = asyncHandler(async (req, res) => {
  const { id } = req.params
  const member = await editorialService.updateEditorialMember(id, req.validated.body)
  return res.status(200).json(member)
})

const deleteMember = asyncHandler(async (req, res) => {
  const { id } = req.params
  const result = await editorialService.deleteEditorialMember(id)
  if (!result.deleted) {
    return res.status(404).json({ message: 'Member not found' })
  }
  res.status(204).end()
})

module.exports = {
  listRoles,
  createRole,
  updateRole,
  deleteRole,
  createMember,
  updateMember,
  deleteMember
}
