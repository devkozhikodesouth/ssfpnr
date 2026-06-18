import { z } from 'zod'
import {
  requiredString,
  optionalString,
  optionalCategory,
  optionalNumber,
  seoSchema,
  visibilitySchema,
} from './shared'

export const downloadSchema = z.object({
  name: requiredString('Name is required'),
  slug: optionalString,
  file: optionalString,
  fileType: optionalString,
  fileSize: optionalNumber,
  categoryId: optionalCategory,
  requiresAuth: z.boolean().optional(),
  seo: seoSchema,
  visibility: visibilitySchema,
})

export default downloadSchema
