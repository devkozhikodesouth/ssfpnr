require('dotenv').config({ path: '.env.local' })

const connectDB = require('../lib/db')
const NavPath = require('../models/NavPath')

// Default navigation across the three locations. Top nav mirrors the public
// modules; bottom nav matches SiteConfig.mobile defaults; footer carries the
// secondary links. Upserted by (location, path) so re-running is idempotent.
const NAV_PATHS = [
  // ── Top navigation ──────────────────────────────────────────────────────────
  { label: 'Home', labelMl: 'ഹോം', path: '/', location: 'top-nav', order: 0 },
  { label: 'About', labelMl: 'ഞങ്ങളെക്കുറിച്ച്', path: '/about', location: 'top-nav', order: 1 },
  { label: 'News', labelMl: 'വാർത്തകൾ', path: '/news', location: 'top-nav', order: 2 },
  { label: 'Gallery', labelMl: 'ഗാലറി', path: '/gallery', location: 'top-nav', order: 3 },
  { label: 'Videos', labelMl: 'വീഡിയോ', path: '/video', location: 'top-nav', order: 4 },
  { label: 'Blogs', labelMl: 'ബ്ലോഗ്', path: '/blogs', location: 'top-nav', order: 5 },
  { label: 'Events', labelMl: 'ഇവന്റുകൾ', path: '/events', location: 'top-nav', order: 6 },
  { label: 'Downloads', labelMl: 'ഡൗൺലോഡ്', path: '/downloads', location: 'top-nav', order: 7 },

  // ── Mobile bottom navigation ──────────────────────────────────────────────────
  { label: 'Home', labelMl: 'ഹോം', path: '/', location: 'bottom-nav', order: 0, icon: 'home' },
  { label: 'News', labelMl: 'വാർത്തകൾ', path: '/news', location: 'bottom-nav', order: 1, icon: 'newspaper' },
  { label: 'Gallery', labelMl: 'ഗാലറി', path: '/gallery', location: 'bottom-nav', order: 2, icon: 'image' },
  { label: 'More', labelMl: 'കൂടുതൽ', path: '#menu', location: 'bottom-nav', order: 3, icon: 'menu' },

  // ── Footer links ──────────────────────────────────────────────────────────────
  { label: 'About', path: '/about', location: 'footer', order: 0 },
  { label: 'News', path: '/news', location: 'footer', order: 1 },
  { label: 'Events', path: '/events', location: 'footer', order: 2 },
  { label: 'Downloads', path: '/downloads', location: 'footer', order: 3 },
]

async function seed() {
  await connectDB()
  console.log('Connected to MongoDB\n')
  console.log('Seeding nav paths...')

  for (const nav of NAV_PATHS) {
    await NavPath.findOneAndUpdate(
      { location: nav.location, path: nav.path },
      { $set: nav },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )
    console.log(`  ✓ [${nav.location}] ${nav.label}`)
  }

  const total = await NavPath.countDocuments()
  console.log(`\nDone. ${NAV_PATHS.length} nav paths seeded (${total} total in collection).`)
  process.exit(0)
}

seed().catch((err) => {
  console.error('\nSeed failed:', err.message)
  process.exit(1)
})
