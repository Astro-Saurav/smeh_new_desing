const { z } = require('zod')

const createRoleSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').max(100),
    description: z.string().optional(),
    display_order: z.number().int().default(0)
  })
})

const updateRoleSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid role ID')
  }),
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    description: z.string().optional(),
    display_order: z.number().int().optional()
  })
})

const createMemberSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').max(100),
    role_id: z.string().uuid('Invalid role ID'),
    image: z.string().optional().nullable(),
    tagline: z.string().optional().nullable(),
    email: z.string().optional().nullable(),
    contact: z.string().optional().nullable(),
    social_link: z.string().optional().nullable(),
    display_order: z.number().int().default(0)
  })
})

const updateMemberSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid member ID')
  }),
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    role_id: z.string().uuid('Invalid role ID').optional(),
    image: z.string().optional().nullable(),
    tagline: z.string().optional().nullable(),
    email: z.string().optional().nullable(),
    contact: z.string().optional().nullable(),
    social_link: z.string().optional().nullable(),
    display_order: z.number().int().optional()
  })
})

const idParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid ID')
  })
})

module.exports = {
  createRoleSchema,
  updateRoleSchema,
  createMemberSchema,
  updateMemberSchema,
  idParamSchema
}
