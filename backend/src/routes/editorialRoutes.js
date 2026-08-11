const express = require('express')
const {
  listRoles,
  createRole,
  updateRole,
  deleteRole,
  createMember,
  updateMember,
  deleteMember
} = require('../controllers/editorialController')
const { authenticate, authorize } = require('../middleware/authMiddleware')
const { validateRequest } = require('../middleware/validateRequest')
const {
  createRoleSchema,
  updateRoleSchema,
  createMemberSchema,
  updateMemberSchema,
  idParamSchema
} = require('../validators/editorialSchemas')

const editorialRouter = express.Router()

// Public endpoint
editorialRouter.get('/', listRoles)

// Admin endpoints for roles
editorialRouter.post('/roles', authenticate, authorize('admin', 'editor'), validateRequest(createRoleSchema), createRole)
editorialRouter.put('/roles/:id', authenticate, authorize('admin', 'editor'), validateRequest(updateRoleSchema), updateRole)
editorialRouter.delete('/roles/:id', authenticate, authorize('admin'), validateRequest(idParamSchema), deleteRole)

// Admin endpoints for members
editorialRouter.post('/members', authenticate, authorize('admin', 'editor'), validateRequest(createMemberSchema), createMember)
editorialRouter.put('/members/:id', authenticate, authorize('admin', 'editor'), validateRequest(updateMemberSchema), updateMember)
editorialRouter.delete('/members/:id', authenticate, authorize('admin'), validateRequest(idParamSchema), deleteMember)

module.exports = {
  editorialRouter
}
