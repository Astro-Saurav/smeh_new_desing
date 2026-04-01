const { z } = require('zod')

const uploadSchema = z.object({
  body: z.object({
    fileName: z.string().min(1),
    mimeType: z.string().regex(/^image\//, 'Only image mime types are allowed'),
    base64Data: z.string().min(1)
  }),
  params: z.object({}),
  query: z.object({})
})

module.exports = {
  uploadSchema
}
