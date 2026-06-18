import { z } from 'zod'
import { requiredString, optionalString } from './shared'

export const roleSchema = z.object({
  name: requiredString('Role name is required'),
  slug: optionalString,
  description: optionalString,
  color: optionalString,
  permissions: z.array(z.string()).optional(),
})

export default roleSchema
