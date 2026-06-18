/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Serve modern formats first for smaller payloads / better LCP (PLAN §18.3).
    formats: ['image/avif', 'image/webp'],
    // Cloudinary is the primary CDN (PLAN §18). It is listed explicitly; the
    // wildcard remotePattern then keeps next/image from hard-crashing on any
    // other https source (e.g. YouTube thumbnails, seeded sample images) while
    // still optimizing all of them.
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'img.youtube.com' },
      { protocol: 'https', hostname: '**' },
    ],
  },
}

module.exports = nextConfig
