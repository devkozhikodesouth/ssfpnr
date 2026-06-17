import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { requirePermission, hasPermission } from '@/lib/permissions'
import { errorResponse, httpError } from '@/lib/api-errors'
import { slugify } from '@/lib/slugify'
import { buildFontFace } from '@/lib/font-face'
import { uploadRaw } from '@/lib/cloudinary'
import connectDB from '@/lib/db'
import Font from '@/models/Font'

export const dynamic = 'force-dynamic'

const MAX_FONT_BYTES = 2 * 1024 * 1024 // 2 MB per file
const FILE_KEYS = ['woff2', 'woff', 'ttf']

/** GET — public lists active fonts; font managers see all fonts. */
export async function GET() {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)
    const filter = hasPermission(session, 'fonts.upload') ? {} : { isActive: true }
    const fonts = await Font.find(filter).sort({ createdAt: -1 }).lean()
    return NextResponse.json({ success: true, data: fonts })
  } catch (err) {
    return errorResponse(err)
  }
}

function parseNumberList(raw) {
  return String(raw || '')
    .split(',')
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => Number.isFinite(n))
}

function parseStringList(raw) {
  return String(raw || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

/** POST — multipart upload of a font (woff2 required, woff/ttf optional). */
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    requirePermission(session, 'fonts.upload')

    await connectDB()
    const fd = await request.formData()

    const name = String(fd.get('name') || '').trim()
    if (!name) throw httpError('Font name is required')

    const weights = parseNumberList(fd.get('weights'))
    const styles = parseStringList(fd.get('styles'))

    const files = {}
    const cloudinaryIds = {}

    for (const key of FILE_KEYS) {
      const file = fd.get(key)
      if (!file || typeof file === 'string') continue

      if (!file.name.toLowerCase().endsWith(`.${key}`)) {
        throw httpError(`The ${key.toUpperCase()} slot must contain a .${key} file`)
      }
      if (file.size > MAX_FONT_BYTES) {
        throw httpError(`${key.toUpperCase()} file exceeds the 2 MB limit`, 413)
      }

      const buffer = Buffer.from(await file.arrayBuffer())
      const result = await uploadRaw(buffer, 'fonts', file.name)
      files[key] = result.url
      cloudinaryIds[key] = result.publicId
    }

    if (!files.woff2) throw httpError('A .woff2 file is required')

    const slug = await generateUniqueSlugNoSoftDelete(name)

    const fontFace = buildFontFace({
      name,
      files,
      weights: weights.length ? weights : [400],
      styles: styles.length ? styles : ['normal'],
    })

    const doc = await Font.create({
      name,
      slug,
      files,
      cloudinaryIds,
      weights: weights.length ? weights : [400],
      styles: styles.length ? styles : ['normal'],
      isActive: false,
      assignedTo: [],
      fontFace,
      uploadedBy: session.user.id,
      createdBy: session.user.id,
      updatedBy: session.user.id,
    })

    const safe = doc.toObject()
    delete safe.cloudinaryIds
    return NextResponse.json({ success: true, data: safe }, { status: 201 })
  } catch (err) {
    return errorResponse(err)
  }
}

// Font has no soft-delete plugin, so generateUniqueSlug's isDeleted query would
// never match. Resolve uniqueness directly against the fonts collection.
async function generateUniqueSlugNoSoftDelete(name) {
  const base = slugify(name) || `font-${Date.now()}`
  let slug = base
  let n = 1
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await Font.findOne({ slug }).select('_id').lean()
    if (!existing) return slug
    n += 1
    slug = `${base}-${n}`
  }
}
