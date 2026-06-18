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

export const videoSchema = z.object({
  title: requiredString('Title is required'),
  slug: optionalString,
  youTubeLink: requiredString('YouTube URL is required'),
  thumbnail: optionalString,
  categoryId: requiredCategory,
  secondaryCategories: z.array(objectId).optional(),
  duration: optionalString,
  description: optionalString,
  transcript: optionalString,
  speakers: z
    .array(z.object({ name: optionalString, role: optionalString }))
    .optional(),
  customCss,
  seo: seoSchema,
  visibility: visibilitySchema,
})

export default videoSchema
