const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') })
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })

const connectDB = require('../lib/db')
const Category = require('../models/Category')

const CATEGORIES = [
  // ── Event-based ─────────────────────────────────────────────────────────────
  {
    name: 'Sahityotsav 26',
    slug: 'sahityotsav-26',
    type: 'event-based',
    isStandalone: true,
    isFeatured: true,
    order: 1,
    color: '#7c3aed',
    description: 'SSF Poonoor Literary Festival 2026',
    appliesTo: ['news', 'video', 'gallery', 'blog', 'event'],
    visibility: { isPublished: true },
  },
  {
    name: 'Sensorium 26',
    slug: 'sensorium-26',
    type: 'event-based',
    isStandalone: true,
    isFeatured: true,
    order: 2,
    color: '#0369a1',
    description: 'Science and Technology Festival 2026',
    appliesTo: ['news', 'video', 'gallery', 'blog', 'event'],
    visibility: { isPublished: true },
  },
  {
    name: 'Vertex',
    slug: 'vertex',
    type: 'event-based',
    isStandalone: true,
    order: 3,
    color: '#059669',
    appliesTo: ['news', 'video', 'gallery', 'event'],
    visibility: { isPublished: true },
  },
  {
    name: 'Zest 2026',
    slug: 'zest-2026',
    type: 'event-based',
    isStandalone: true,
    order: 4,
    color: '#d97706',
    appliesTo: ['news', 'video', 'gallery', 'event'],
    visibility: { isPublished: true },
  },
  {
    name: 'Thartheel',
    slug: 'thartheel',
    type: 'event-based',
    isStandalone: true,
    order: 5,
    color: '#be185d',
    appliesTo: ['news', 'video', 'gallery', 'event'],
    visibility: { isPublished: true },
  },
  {
    name: 'Kuttithottam',
    slug: 'kuttithottam',
    type: 'event-based',
    isStandalone: true,
    order: 6,
    color: '#16a34a',
    appliesTo: ['news', 'video', 'gallery', 'event'],
    visibility: { isPublished: true },
  },
  {
    name: 'Human Library',
    slug: 'human-library',
    type: 'event-based',
    isStandalone: true,
    order: 7,
    color: '#0f766e',
    appliesTo: ['news', 'video', 'blog', 'event'],
    visibility: { isPublished: true },
  },

  // ── Topical ──────────────────────────────────────────────────────────────────
  {
    name: 'General',
    slug: 'general',
    type: 'topical',
    order: 10,
    color: '#6b7280',
    appliesTo: ['news', 'video', 'gallery', 'blog', 'event', 'campaign', 'download'],
    visibility: { isPublished: true },
  },
  {
    name: 'Education',
    slug: 'education',
    type: 'topical',
    order: 11,
    color: '#2563eb',
    appliesTo: ['news', 'blog', 'event'],
    visibility: { isPublished: true },
  },
  {
    name: 'Environment',
    slug: 'environment',
    type: 'topical',
    order: 12,
    color: '#16a34a',
    appliesTo: ['news', 'blog', 'event', 'campaign'],
    visibility: { isPublished: true },
  },
  {
    name: 'Cultural',
    slug: 'cultural',
    type: 'topical',
    order: 13,
    color: '#c026d3',
    appliesTo: ['news', 'video', 'gallery', 'blog', 'event'],
    visibility: { isPublished: true },
  },
  {
    name: 'Political',
    slug: 'political',
    type: 'topical',
    order: 14,
    color: '#dc2626',
    appliesTo: ['news', 'blog'],
    visibility: { isPublished: true },
  },
  {
    name: 'Spiritual',
    slug: 'spiritual',
    type: 'topical',
    order: 15,
    color: '#92400e',
    appliesTo: ['news', 'video', 'blog', 'event'],
    visibility: { isPublished: true },
  },
  {
    name: 'Ahlussunna Talk',
    slug: 'ahlussunna-talk',
    type: 'topical',
    order: 16,
    color: '#1d4ed8',
    appliesTo: ['news', 'video', 'blog'],
    visibility: { isPublished: true },
  },
  {
    name: 'Risala Decode',
    slug: 'risala-decode',
    type: 'topical',
    order: 17,
    color: '#7c3aed',
    appliesTo: ['news', 'video', 'blog'],
    visibility: { isPublished: true },
  },

  // ── Permanent ────────────────────────────────────────────────────────────────
  {
    name: 'Announcement',
    slug: 'announcement',
    type: 'permanent',
    order: 20,
    color: '#ea580c',
    appliesTo: ['news', 'event', 'download'],
    visibility: { isPublished: true },
  },
  {
    name: 'Press Meet',
    slug: 'press-meet',
    type: 'permanent',
    order: 21,
    color: '#4f46e5',
    appliesTo: ['news', 'gallery', 'video'],
    visibility: { isPublished: true },
  },
  {
    name: 'Circular',
    slug: 'circular',
    type: 'permanent',
    order: 22,
    color: '#64748b',
    appliesTo: ['download'],
    visibility: { isPublished: true },
  },
  {
    name: 'Report',
    slug: 'report',
    type: 'permanent',
    order: 23,
    color: '#374151',
    appliesTo: ['news', 'download'],
    visibility: { isPublished: true },
  },
]

async function seed() {
  await connectDB()
  console.log('Connected to MongoDB\n')
  console.log('Seeding categories...')

  for (const cat of CATEGORIES) {
    await Category.findOneAndUpdate(
      { slug: cat.slug },
      { $set: cat },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )
    console.log(`  ✓ ${cat.name}`)
  }

  const total = await Category.countDocuments()
  console.log(`\nDone. ${CATEGORIES.length} categories seeded (${total} total in collection).`)
  process.exit(0)
}

seed().catch(err => {
  console.error('\nSeed failed:', err.message)
  process.exit(1)
})
