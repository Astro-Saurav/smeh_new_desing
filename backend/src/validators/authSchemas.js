const { z } = require('zod')

const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8).max(128),
    role: z.enum(['admin', 'editor']).default('editor')
  }),
  params: z.object({}),
  query: z.object({})
})

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8).max(128)
  }),
  params: z.object({}),
  query: z.object({})
})

module.exports = {
  registerSchema,
  loginSchema
}
