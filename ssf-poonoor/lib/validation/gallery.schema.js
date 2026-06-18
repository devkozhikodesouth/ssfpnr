import { z } from 'zod'
import {
  requiredString,
  optionalString,
  requiredCategory,
  objectId,
  seoSchema,
  visibilitySchema,
} from './shared'

export const gallerySchema = z.object({
  title: requiredString('Title is required'),
  slug: optionalString,
  albumType: z.enum(['single', 'album']).optional(),
  coverImage: optionalString,
  images: z
    .array(
      z.union([
        z.string(),
        z.object({ url: z.string(), caption: optionalString, alt: optionalString, order: z.number().optional() }),
      ])
    )
    .optional(),
  categoryId: requiredCategory,
  secondaryCategories: z.array(objectId).optional(),
  seo: seoSchema,
  visibility: visibilitySchema,
})

export default gallerySchema
