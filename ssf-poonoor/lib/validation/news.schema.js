import { z } from 'zod'
import {
  requiredString,
  optionalString,
  requiredCategory,
  objectId,
  customCss,
  seoSchema,
  visibilitySchema,
} from './shared'

export const newsSchema = z.object({
  title: requiredString('Title is required'),
  slug: optionalString,
  image: optionalString,
  categoryId: requiredCategory,
  secondaryCategories: z.array(objectId).optional(),
  language: z.enum(['ml', 'en', 'both']).optional(),
  excerpt: optionalString,
  content: optionalString,
  author: z
    .object({
      name: optionalString,
      role: optionalString,
      image: optionalString,
    })
    .optional(),
  customCss,
  seo: seoSchema,
  visibility: visibilitySchema,
})

export default newsSchema
