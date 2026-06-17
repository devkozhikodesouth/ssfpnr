import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { uploadImage, uploadRaw } from '@/lib/cloudinary'

export const dynamic = 'force-dynamic'

const MAX_IMAGE_BYTES = 5 * 1024 * 1024 // 5 MB
const MAX_RAW_BYTES = 10 * 1024 * 1024 // 10 MB (PDF/doc)

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'image/avif']

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file')
    const folder = formData.get('folder') || 'misc'

    if (!file || typeof file === 'string') {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 })
    }

    const isImage = IMAGE_TYPES.includes(file.type)
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
