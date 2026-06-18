// Verifies Cloudinary is wired up correctly using the project's lib/cloudinary.js.
// It uploads a tiny 1x1 PNG to ssf-poonoor/_verify, then deletes it.
// Usage:  node scripts/verify-cloudinary.js

const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') })
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })

const { uploadImage, deleteAsset } = require('../lib/cloudinary')

// A minimal valid 1x1 transparent PNG.
const PNG_1x1 = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64'
)

;(async () => {
  const cn = process.env.CLOUDINARY_CLOUD_NAME
  console.log('Cloud name:', cn || '(CLOUDINARY_CLOUD_NAME not set)')
  if (!cn || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error('\n❌ FAILED: one or more CLOUDINARY_* env vars are missing')
    process.exit(1)
  }
  const started = Date.now()
  try {
    const res = await uploadImage(PNG_1x1, '_verify')
    console.log('Uploaded:', res.url)
    console.log('Public ID:', res.publicId, `(${res.width}x${res.height} ${res.format})`)
    const del = await deleteAsset(res.publicId, 'image')
    console.log('Cleanup:', JSON.stringify(del))
    console.log(`\n✅ SUCCESS — uploaded & deleted in ${Date.now() - started} ms`)
    process.exit(0)
  } catch (err) {
    console.error('\n❌ FAILED:', err.message)
    process.exit(1)
  }
})()
