import { z } from 'zod'
import {
  requiredString,
  optionalString,
  optionalCategory,
  optionalNumber,
  customCss,
  seoSchema,
  visibilitySchema,
} from './shared'

const dateLike = z.union([z.string(), z.date(), z.null()]).optional()

export const eventSchema = z.object({
  title: requiredString('Title is required'),
  slug: optionalString,
  image: optionalString,
  categoryId: optionalCategory,
  fromDate: dateLike,
  toDate: dateLike,
  location: optionalString,
  venue: optionalString,
  registrationLink: optionalString,
  capacity: optionalNumber,
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

export default eventSchema
