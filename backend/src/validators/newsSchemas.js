const { z } = require('zod')

const statusEnum = z.enum(['draft', 'published', 'scheduled'])
const SUPPORTED_FONTS = ['Inter', 'Playfair Display', 'Merriweather', 'Lato', 'Source Serif 4']
const fontEnum = z.enum(SUPPORTED_FONTS)

const createNewsSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(300),
    content: z.string().optional().nullable(),
    categoryId: z.string(),
    imageUrl: z.string().optional().nullable().transform(v => v === '' ? null : v).pipe(z.string().url().optional().nullable()),
    youtubeUrl: z.string().optional().nullable().transform(v => v === '' ? null : v).pipe(z.string().url().optional().nullable()),
    excerpt: z.string().optional().nullable(),
    thumbnailMediaId: z.string().uuid().optional().nullable(),
    documentMediaId: z.string().uuid().optional().nullable(),
    imagesMediaIds: z.array(z.string().uuid()).optional().nullable(),
    status: statusEnum,
    publishedAt: z.string().datetime().optional().nullable(),
    isFeatured: z.boolean().optional(),
    isPinned: z.boolean().optional(),
    isBreaking: z.boolean().optional(),
    titleFont: fontEnum.optional().nullable(),
    excerptFont: fontEnum.optional().nullable(),
    contentFont: fontEnum.optional().nullable(),
    authorName: z.string().optional().nullable()
  }),
  params: z.object({}),
  query: z.object({})
})

const updateNewsSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(300).optional(),
    content: z.string().optional().nullable(),
    categoryId: z.string().optional(),
    imageUrl: z.string().optional().nullable().transform(v => v === '' ? null : v).pipe(z.string().url().optional().nullable()),
    youtubeUrl: z.string().optional().nullable().transform(v => v === '' ? null : v).pipe(z.string().url().optional().nullable()),
    excerpt: z.string().optional().nullable(),
    thumbnailMediaId: z.string().uuid().optional().nullable(),
    documentMediaId: z.string().uuid().optional().nullable(),
    imagesMediaIds: z.array(z.string().uuid()).optional().nullable(),
    status: statusEnum.optional(),
    publishedAt: z.string().datetime().optional().nullable(),
    isFeatured: z.boolean().optional(),
    isPinned: z.boolean().optional(),
    isBreaking: z.boolean().optional(),
    titleFont: fontEnum.optional().nullable(),
    excerptFont: fontEnum.optional().nullable(),
    contentFont: fontEnum.optional().nullable(),
    authorName: z.string().optional().nullable()
  }).refine((value) => Object.keys(value).length > 0, {
    message: 'At least one field is required for update'
  }),
  params: z.object({
    id: z.string().uuid()
  }),
  query: z.object({})
})

const idParamSchema = z.object({
  body: z.object({}),
  params: z.object({
    id: z.string().uuid()
  }),
  query: z.object({})
})

const slugParamSchema = z.object({
  body: z.object({}),
  params: z.object({
    slug: z.string().min(1)
  }),
  query: z.object({})
})

const listNewsSchema = z.object({
  body: z.object({}),
  params: z.object({}),
  query: z.object({
    category: z.string().optional(),
    search: z.string().optional(),
    status: statusEnum.optional(),
    page: z.coerce.number().int().min(1).optional(),
    pageSize: z.coerce.number().int().min(1).max(100).optional()
  })
})

module.exports = {
  createNewsSchema,
  updateNewsSchema,
  idParamSchema,
  listNewsSchema,
  slugParamSchema
}
