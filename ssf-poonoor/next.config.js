/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Cloudinary is the primary CDN (PLAN §18). The wildcard remotePattern keeps
    // next/image from hard-crashing on any other https source (e.g. YouTube
    // thumbnails, seeded sample images) while still optimizing all of them.
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
}

module.exports = nextConfig
