const { v2: cloudinary } = require('cloudinary')

let configured = false

function configure() {
  if (configured) return
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  })
  configured = true
}

const ROOT_FOLDER = 'ssf-poonoor'

function streamUpload(buffer, options) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (err, result) => {
      if (err) return reject(err)
      resolve(result)
    })
    stream.end(buffer)
  })
}

/**
 * Upload an image buffer to Cloudinary.
 * @param {Buffer} buffer
 * @param {string} [folder]  sub-folder under ssf-poonoor/ (e.g. 'news')
 * @returns {Promise<{ url: string, publicId: string, width: number, height: number, format: string }>}
 */
async function uploadImage(buffer, folder = 'misc') {
  configure()
  const result = await streamUpload(buffer, {
    folder: `${ROOT_FOLDER}/${folder}`,
    resource_type: 'image',
  })
  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    format: result.format,
  }
}

/**
 * Upload a raw (non-image) asset — PDFs, docs, fonts.
 * @param {Buffer} buffer
 * @param {string} [folder]
 * @param {string} [filename]  preserve original filename for download
 * @returns {Promise<{ url: string, publicId: string, format: string, bytes: number }>}
 */
async function uploadRaw(buffer, folder = 'misc', filename) {
  configure()
  const result = await streamUpload(buffer, {
    folder: `${ROOT_FOLDER}/${folder}`,
    resource_type: 'raw',
    ...(filename ? { public_id: filename.replace(/\.[^.]+$/, '') } : {}),
  })
  return {
    url: result.secure_url,
    publicId: result.public_id,
    format: result.format,
    bytes: result.bytes,
  }
}

/**
 * Delete an asset by its public id.
 * @param {string} publicId
 * @param {'image'|'raw'|'video'} [resourceType]
 */
async function deleteAsset(publicId, resourceType = 'image') {
  configure()
  if (!publicId) return null
  return cloudinary.uploader.destroy(publicId, { resource_type: resourceType })
}

module.exports = { uploadImage, uploadRaw, deleteAsset, cloudinary }
