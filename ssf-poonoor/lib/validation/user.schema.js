import { z } from 'zod'
import { requiredString, optionalString, objectId } from './shared'

// On create a password is required; on edit it may be left blank to keep the
// existing one. Build the right schema with userSchema({ isEdit }).
export function userSchema({ isEdit = false } = {}) {
  return z.object({
    name: requiredString('Name is required'),
    username: requiredString('Username is required'),
    email: optionalString,
    phone: optionalString,
    password: isEdit
      ? z.string().optional()
      : requiredString('Password is required').min(8, 'Password must be at least 8 characters'),
    roleId: objectId,
    permissions: z.array(z.string()).optional(),
    avatar: optionalString,
    isActive: z.boolean().optional(),
  })
}

export default userSchema
