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

export const blogSchema = z.object({
  title: requiredString('Title is required'),
  slug: optionalString,
  image: optionalString,
  categoryId: requiredCategory,
  secondaryCategories: z.array(objectId).optional(),
  tags: z.array(z.string()).optional(),
  excerpt: optionalString,
  content: optionalString,
  author: z
    .object({
      name: optionalString,
      role: optionalString,
      image: optionalString,
      bio: optionalString,
    })
    .optional(),
  customCss,
  seo: seoSchema,
  visibility: visibilitySchema,
})

export default blogSchema
