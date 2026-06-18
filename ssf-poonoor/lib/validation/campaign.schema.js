import { z } from 'zod'
import {
  requiredString,
  optionalString,
  optionalCategory,
  customCss,
  seoSchema,
  visibilitySchema,
} from './shared'

const dateLike = z.union([z.string(), z.date(), z.null()]).optional()

export const campaignSchema = z.object({
  title: requiredString('Title is required'),
  slug: optionalString,
  bannerImage: optionalString,
  categoryId: optionalCategory,
  fromDate: dateLike,
  toDate: dateLike,
  isActive: z.boolean().optional(),
  content: optionalString,
  linkedItems: z
    .object({
      news: z.array(z.string()).optional(),
      videos: z.array(z.string()).optional(),
      gallery: z.array(z.string()).optional(),
      blogs: z.array(z.string()).optional(),
    })
    .optional(),
  customCss,
  seo: seoSchema,
  visibility: visibilitySchema,
})

export default campaignSchema
