const { z } = require('zod')

const idParamSchema = z.object({
  body: z.object({}),
  params: z.object({
    id: z.string().uuid()
  }),
  query: z.object({})
})

module.exports = {
  idParamSchema
}
