const { z } = require('zod')

const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2).max(120)
  }),
  params: z.object({}),
  query: z.object({})
})

const idParamSchema = z.object({
  body: z.object({}),
  params: z.object({ id: z.string().uuid() }),
  query: z.object({})
})

module.exports = {
  idParamSchema,
  createCategorySchema
}
