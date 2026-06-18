import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { uploadImage, uploadRaw } from '@/lib/cloudinary'
import { rateLimit, clientIp } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

const MAX_IMAGE_BYTES = 5 * 1024 * 1024 // 5 MB
const MAX_RAW_BYTES = 10 * 1024 * 1024 // 10 MB (PDF/doc)

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'image/avif']

// Strict allowlist for raw (non-image) uploads — documents only. Anything not
// in IMAGE_TYPES or RAW_TYPES is rejected (allowlist, never a blocklist).
const RAW_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  'text/csv',
  'application/zip',
]

export async function POST(request) {
  try {
    // Authenticated-only (not a single requirePermission): this is a shared
    // helper used by every content form, each of which is itself permission-
    // gated on save. Any logged-in admin who can reach a form may upload.
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    // Soft rate limit: 20 uploads / minute / IP (lib/rate-limit).
    const { allowed, retryAfter } = rateLimit('upload', clientIp(request))
    if (!allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many uploads, please slow down' },
        { status: 429, headers: { 'Retry-After': String(retryAfter) } }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file')
    const folder = formData.get('folder') || 'misc'

    if (!file || typeof file === 'string') {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 })
    }

    const isImage = IMAGE_TYPES.includes(file.type)
    const isRaw = RAW_TYPES.includes(file.type)
    if (!isImage && !isRaw) {
      return NextResponse.json(
        { success: false, error: `Unsupported file type: ${file.type || 'unknown'}` },
        { status: 415 }
      )
    }

    const maxBytes = isImage ? MAX_IMAGE_BYTES : MAX_RAW_BYTES
    if (file.size > maxBytes) {
      return NextResponse.json(
        { success: false, error: `File exceeds the ${Math.round(maxBytes / 1024 / 1024)} MB limit` },
        { status: 413 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    const result = isImage
      ? await uploadImage(buffer, String(folder))
      : await uploadRaw(buffer, String(folder), file.name)

    return NextResponse.json({ success: true, data: result }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ success: false, error: err?.message || 'Upload failed' }, { status: 500 })
  }
}
