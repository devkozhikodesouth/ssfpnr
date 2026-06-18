import { z } from 'zod'
import { requiredString, optionalString } from './shared'

const MODULES = ['news', 'video', 'gallery', 'blog', 'event', 'campaign', 'download']

export const categorySchema = z.object({
  name: requiredString('Name is required'),
  slug: requiredString('Slug is required'),
  description: optionalString,
  coverImage: optionalString,
  icon: optionalString,
  color: optionalString,
  type: z.enum(['event-based', 'topical', 'permanent'], {
    message: 'Type is required',
  }),
  appliesTo: z.array(z.enum(MODULES)).optional(),
  isStandalone: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  order: z.union([z.number(), z.literal('')]).optional(),
  visibility: z.object({ isPublished: z.boolean().optional() }).optional(),
})

export default categorySchema
