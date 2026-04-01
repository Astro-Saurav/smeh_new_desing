const { z } = require('zod')

const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2).max(120)
  }),
  params: z.object({}),
  query: z.object({})
})

module.exports = {
  createCategorySchema
}
