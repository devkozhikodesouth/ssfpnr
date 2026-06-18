// Central registry mapping a content module key to its zod schema, so shared
// forms (ContentForm) can look the schema up by module. Per-model schemas live
// in their own *.schema.js file (PLAN Phase 9a).

import { newsSchema } from './news.schema'
import { blogSchema } from './blog.schema'
import { videoSchema } from './video.schema'
import { gallerySchema } from './gallery.schema'
import { campaignSchema } from './campaign.schema'
import { eventSchema } from './event.schema'
import { downloadSchema } from './download.schema'
import { categorySchema } from './category.schema'

export const MODULE_SCHEMAS = {
  news: newsSchema,
  blogs: blogSchema,
  video: videoSchema,
  gallery: gallerySchema,
  campaigns: campaignSchema,
  events: eventSchema,
  downloads: downloadSchema,
}

/** Schema for a content module key, or null if none is registered. */
export function getModuleSchema(module) {
  return MODULE_SCHEMAS[module] || null
}

/**
 * Run a zod schema against a form payload and return a flat
 * `{ field: message }` map of the first error per top-level field.
 * Returns an empty object when valid.
 */
export function collectErrors(schema, values) {
  if (!schema) return {}
  const result = schema.safeParse(values)
  if (result.success) return {}
  const errors = {}
  for (const issue of result.error.issues) {
    const key = issue.path[0]
    if (key != null && errors[key] === undefined) {
      errors[key] = issue.message
    }
  }
  return errors
}

export { categorySchema }
