import { z } from 'zod'

// Shared zod building blocks reused across the per-model form schemas
// (lib/validation/*.schema.js). These validate the client form payload before
// it is sent to the API; the API performs its own authoritative checks.

/** A 24-char hex Mongo ObjectId, as it arrives from the form (string). */
export const objectId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, 'Invalid selection')

/** A required category select — empty string yields a friendly message. */
export const requiredCategory = z
  .string()
  .min(1, 'Category is required')
  .regex(/^[0-9a-fA-F]{24}$/, 'Invalid category')

/** Optional category — allows an empty string (no selection). */
export const optionalCategory = z
  .union([objectId, z.literal('')])
  .optional()

/** Optional free text (treats undefined and '' alike). */
export const optionalString = z.string().optional()

/** A required, non-empty trimmed string with a custom message. */
export const requiredString = (msg) => z.string().trim().min(1, msg)

/** Per-item custom CSS — capped at the 50 KB limit from PLAN §22. */
export const customCss = z
  .string()
  .max(51200, 'Custom CSS exceeds the 50 KB limit')
  .optional()

/** A number input that may be left blank ('') in the form. */
export const optionalNumber = z.union([z.number(), z.literal('')]).optional()

export const seoSchema = z
  .object({
    metaTitle: z.string().max(70, 'Meta title must be 70 characters or fewer').optional(),
    metaDescription: z
      .string()
      .max(160, 'Meta description must be 160 characters or fewer')
      .optional(),
    metaKeywords: z.array(z.string()).optional(),
    ogImage: optionalString,
    canonicalUrl: optionalString,
    noIndex: z.boolean().optional(),
  })
  .optional()

export const visibilitySchema = z
  .object({
    isPublished: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
    isPinned: z.boolean().optional(),
    publishAt: z.union([z.string(), z.date(), z.null()]).optional(),
    unpublishAt: z.union([z.string(), z.date(), z.null()]).optional(),
  })
  .optional()
