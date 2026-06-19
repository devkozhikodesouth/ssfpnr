const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') })
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })

// Demo content seed (PLAN Phase 9a). Populates the "Sahityotsav 26" category
// with a representative set of published items so the portal can be demoed end
// to end. Idempotent: every item is upserted by slug, so re-running updates in
// place rather than duplicating. Does NOT modify the other seed scripts.

const connectDB = require('../lib/db')
const Category = require('../models/Category')
const User = require('../models/User')
const News = require('../models/News')
const Blog = require('../models/Blog')
const Video = require('../models/Video')
const Gallery = require('../models/Gallery')
const Campaign = require('../models/Campaign')
const Event = require('../models/Event')
const Download = require('../models/Download')

const CATEGORY_SLUG = 'sahityotsav-26'
const img = (id) => `https://picsum.photos/seed/${id}/1200/675`

function daysFromNow(n) {
  return new Date(Date.now() + n * 24 * 60 * 60 * 1000)
}

async function upsert(Model, slugField, slug, doc) {
  const saved = await Model.findOneAndUpdate(
    { [slugField]: slug },
    { $set: doc },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  )
  return saved
}

async function seed() {
  await connectDB()
  console.log('Connected to MongoDB\n')

  // The category must exist first (run `npm run seed:categories`).
  const category = await Category.findOne({ slug: CATEGORY_SLUG })
  if (!category) {
    throw new Error(
      `Category "${CATEGORY_SLUG}" not found. Run "npm run seed:categories" first.`
    )
  }
  const categoryId = category._id

  // Attribute content to the seeded admin when present (createdBy is optional).
  const admin = await User.findOne({ isDeleted: false }).select('_id').lean()
  const by = admin?._id || undefined

  const published = { visibility: { isPublished: true } }
  const base = (extra) => ({
    categoryId,
    publishedAt: new Date(),
    createdBy: by,
    updatedBy: by,
    ...published,
    ...extra,
  })

  console.log(`Seeding demo content under "${category.name}"...`)

  // ── News (3) ────────────────────────────────────────────────────────────────
  const news = [
    {
      slug: 'sahityotsav-26-grand-opening',
      title: 'Sahityotsav 26 Opens with a Grand Literary Gathering',
      excerpt: 'The annual literary festival kicked off with poetry, prose and packed halls.',
      content: '<p>The 2026 edition of Sahityotsav opened to an enthusiastic crowd…</p>',
      image: img('ssf-news-1'),
    },
    {
      slug: 'sahityotsav-26-poetry-symposium',
      title: 'Poetry Symposium Draws Record Participation',
      excerpt: 'Young poets from across the division shared the stage this evening.',
      content: '<p>The poetry symposium saw a record number of participants…</p>',
      image: img('ssf-news-2'),
    },
    {
      slug: 'sahityotsav-26-award-night',
      title: 'Award Night Celebrates Emerging Writers',
      excerpt: 'Winners of the short-story and essay contests were felicitated.',
      content: '<p>The award night brought the festival to a memorable close…</p>',
      image: img('ssf-news-3'),
    },
  ]
  for (const n of news) {
    await upsert(News, 'slug', n.slug, base({ ...n, language: 'ml' }))
    console.log(`  ✓ news: ${n.title}`)
  }

  // ── Blogs (2) ────────────────────────────────────────────────────────────────
  const blogs = [
    {
      slug: 'reflections-on-sahityotsav-26',
      title: 'Reflections on Sahityotsav 26',
      excerpt: 'What this year’s festival meant for our reading community.',
      content: '<p>Every edition of Sahityotsav leaves us with new stories…</p>',
      image: img('ssf-blog-1'),
      tags: ['literature', 'festival'],
      author: { name: 'Editorial Team', role: 'SSF Poonoor' },
    },
    {
      slug: 'why-literary-festivals-matter',
      title: 'Why Literary Festivals Still Matter',
      excerpt: 'In an age of feeds, gathering around books remains powerful.',
      content: '<p>Literary festivals create space for slow, shared attention…</p>',
      image: img('ssf-blog-2'),
      tags: ['opinion', 'culture'],
      author: { name: 'Editorial Team', role: 'SSF Poonoor' },
    },
  ]
  for (const b of blogs) {
    await upsert(Blog, 'slug', b.slug, base(b))
    console.log(`  ✓ blog: ${b.title}`)
  }

  // ── Videos (2) ───────────────────────────────────────────────────────────────
  const videos = [
    {
      slug: 'sahityotsav-26-highlights',
      title: 'Sahityotsav 26 — Highlights',
      youTubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnail: img('ssf-video-1'),
      duration: '04:12',
      description: 'A quick recap of the festival’s best moments.',
    },
    {
      slug: 'sahityotsav-26-keynote',
      title: 'Sahityotsav 26 — Keynote Address',
      youTubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnail: img('ssf-video-2'),
      duration: '22:40',
      description: 'The full keynote from the opening ceremony.',
    },
  ]
  for (const v of videos) {
    await upsert(Video, 'slug', v.slug, base(v))
    console.log(`  ✓ video: ${v.title}`)
  }

  // ── Gallery album (1, with 5 images) ─────────────────────────────────────────
  const galleryImages = Array.from({ length: 5 }).map((_, i) => ({
    url: img(`ssf-gallery-${i + 1}`),
    caption: `Sahityotsav 26 — moment ${i + 1}`,
    alt: `Sahityotsav 26 photo ${i + 1}`,
    order: i,
  }))
  await upsert(Gallery, 'slug', 'sahityotsav-26-album', base({
    title: 'Sahityotsav 26 — Photo Album',
    albumType: 'album',
    coverImage: galleryImages[0].url,
    images: galleryImages,
  }))
  console.log('  ✓ gallery: Sahityotsav 26 — Photo Album (5 images)')

  // ── Campaign (1) ─────────────────────────────────────────────────────────────
  await upsert(Campaign, 'slug', 'sahityotsav-26-campaign', base({
    title: 'Sahityotsav 26 Reading Challenge',
    bannerImage: img('ssf-campaign-1'),
    content: '<p>Join the reading challenge running through the festival season.</p>',
    fromDate: daysFromNow(-3),
    toDate: daysFromNow(20),
    isActive: true,
  }))
  console.log('  ✓ campaign: Sahityotsav 26 Reading Challenge')

  // ── Event (1) ────────────────────────────────────────────────────────────────
  await upsert(Event, 'slug', 'sahityotsav-26-closing-ceremony', base({
    title: 'Sahityotsav 26 Closing Ceremony',
    image: img('ssf-event-1'),
    content: '<p>Be part of the grand closing ceremony and award night.</p>',
    fromDate: daysFromNow(7),
    toDate: daysFromNow(7),
    location: 'Poonoor',
    venue: 'Town Hall',
  }))
  console.log('  ✓ event: Sahityotsav 26 Closing Ceremony')

  // ── Download (1) ─────────────────────────────────────────────────────────────
  await upsert(Download, 'slug', 'sahityotsav-26-brochure', base({
    name: 'Sahityotsav 26 Brochure',
    file: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileType: 'pdf',
    requiresAuth: false,
  }))
  console.log('  ✓ download: Sahityotsav 26 Brochure')

  console.log('\nDemo seed complete.')
  process.exit(0)
}

seed().catch((err) => {
  console.error('\nDemo seed failed:', err.message)
  process.exit(1)
})
