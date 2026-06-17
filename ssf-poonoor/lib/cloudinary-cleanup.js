const { deleteAsset } = require('./cloudinary')

/**
 * Parse a Cloudinary delivery URL back into the { publicId, resourceType }
 * needed to destroy the asset. Returns null for non-Cloudinary / unparseable
 * URLs (e.g. manually pasted external image links), which are simply skipped.
 *
 * Example:
 *   https://res.cloudinary.com/demo/image/upload/v123/ssf-poonoor/news/abc.jpg
 *   → { publicId: 'ssf-poonoor/news/abc', resourceType: 'image' }
 */
function parseCloudinaryUrl(url) {
  if (typeof url !== 'string' || !url.includes('res.cloudinary.com')) return null
  try {
    const { pathname } = new URL(url)
    // /<cloud>/<resourceType>/<deliveryType>/<...path>
    const segments = pathname.split('/').filter(Boolean)
    const uploadIdx = segments.indexOf('upload')
    if (uploadIdx < 1) return null

    const resourceType = segments[uploadIdx - 1] // image | raw | video
    let rest = segments.slice(uploadIdx + 1)

    // Drop a leading transformation segment if present (no '.', contains '_' or ',').
    if (rest.length && /[,_]/.test(rest[0]) && !rest[0].includes('.')) rest = rest.slice(1)
    // Drop the version segment (v1234567890).
    if (rest.length && /^v\d+$/.test(rest[0])) rest = rest.slice(1)
    if (!rest.length) return null

    let publicId = rest.join('/')
    // Images/videos drop the format extension; raw assets keep their public_id as-is.
    if (resourceType !== 'raw') publicId = publicId.replace(/\.[^./]+$/, '')

    return { publicId, resourceType }
  } catch {
    return null
  }
}

/**
 * Destroy every Cloudinary asset referenced by an item before it is permanently
 * purged. Best-effort: failures are collected but do not abort the purge.
 *
 * @param {object} item                  the lean document being purged
 * @param {object} spec
 * @param {string[]} [spec.assetFields]      string-URL image fields (image, bannerImage…)
 * @param {string[]} [spec.imageArrayFields] array-of-{url} fields (gallery images)
 * @param {string[]} [spec.rawFields]        raw asset URL fields (download file)
 */
async function deleteItemAssets(item, spec = {}) {
  if (!item) return
  const urls = []

  for (const f of spec.assetFields || []) {
    if (item[f]) urls.push(item[f])
  }
  for (const f of spec.rawFields || []) {
    if (item[f]) urls.push(item[f])
  }
  for (const f of spec.imageArrayFields || []) {
    for (const img of item[f] || []) {
      if (img?.url) urls.push(img.url)
    }
  }

  await Promise.allSettled(
    urls
      .map(parseCloudinaryUrl)
      .filter(Boolean)
      .map(({ publicId, resourceType }) => deleteAsset(publicId, resourceType))
  )
}

module.exports = { parseCloudinaryUrl, deleteItemAssets }
