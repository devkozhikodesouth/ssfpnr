require('dotenv').config({ path: '.env.local' })

const connectDB = require('../lib/db')
const Role = require('../models/Role')
const User = require('../models/User')
const SiteConfig = require('../models/SiteConfig')

const ROLES = [
  {
    name: 'Super Admin',
    slug: 'super-admin',
    description: 'System owner with full access to all modules and settings',
    isSystem: true,
    color: '#ef4444',
    permissions: [
      'news.create', 'news.read', 'news.update', 'news.delete', 'news.publish', 'news.custom-css',
      'gallery.create', 'gallery.read', 'gallery.update', 'gallery.delete', 'gallery.publish',
      'video.create', 'video.read', 'video.update', 'video.delete', 'video.publish', 'video.custom-css',
      'blogs.create', 'blogs.read', 'blogs.update', 'blogs.delete', 'blogs.publish', 'blogs.custom-css',
      'campaigns.create', 'campaigns.read', 'campaigns.update', 'campaigns.delete', 'campaigns.publish',
      'events.create', 'events.read', 'events.update', 'events.delete', 'events.publish',
      'downloads.create', 'downloads.read', 'downloads.update', 'downloads.delete', 'downloads.publish',
      'categories.manage',
      'users.manage', 'roles.manage',
      'site.configure', 'fonts.upload', 'paths.manage',
      'trash.view', 'trash.restore', 'trash.purge',
      'analytics.view',
    ],
  },
  {
    name: 'Site Manager',
    slug: 'site-manager',
    description: 'Manages site appearance, navigation, categories, and fonts',
    isSystem: true,
    color: '#8b5cf6',
    permissions: [
      'categories.manage',
      'site.configure', 'fonts.upload', 'paths.manage',
      'analytics.view',
    ],
  },
  {
    name: 'Media Manager',
    slug: 'media-manager',
    description: 'Manages gallery, video, and downloads',
    isSystem: true,
    color: '#3b82f6',
    permissions: [
      'gallery.create', 'gallery.read', 'gallery.update', 'gallery.delete', 'gallery.publish',
      'video.create', 'video.read', 'video.update', 'video.delete', 'video.publish',
      'downloads.create', 'downloads.read', 'downloads.update', 'downloads.delete', 'downloads.publish',
      'trash.view', 'trash.restore',
      'analytics.view',
    ],
  },
  {
    name: 'Content Manager',
    slug: 'content-manager',
    description: 'Manages news and blog content',
    isSystem: true,
    color: '#10b981',
    permissions: [
      'news.create', 'news.read', 'news.update', 'news.delete', 'news.publish',
      'blogs.create', 'blogs.read', 'blogs.update', 'blogs.delete', 'blogs.publish',
      'trash.view', 'trash.restore',
      'analytics.view',
    ],
  },
  {
    name: 'Program Manager',
    slug: 'program-manager',
    description: 'Manages events and campaigns',
    isSystem: true,
    color: '#f59e0b',
    permissions: [
      'campaigns.create', 'campaigns.read', 'campaigns.update', 'campaigns.delete', 'campaigns.publish',
      'events.create', 'events.read', 'events.update', 'events.delete', 'events.publish',
      'trash.view', 'trash.restore',
      'analytics.view',
    ],
  },
  {
    name: 'Editor',
    slug: 'editor',
    description: 'Can create and edit drafts across all modules but cannot publish',
    isSystem: true,
    color: '#6b7280',
    permissions: [
      'news.create', 'news.read', 'news.update',
      'gallery.create', 'gallery.read', 'gallery.update',
      'video.create', 'video.read', 'video.update',
      'blogs.create', 'blogs.read', 'blogs.update',
      'campaigns.create', 'campaigns.read', 'campaigns.update',
      'events.create', 'events.read', 'events.update',
      'downloads.create', 'downloads.read', 'downloads.update',
    ],
  },
  {
    name: 'Viewer',
    slug: 'viewer',
    description: 'Read-only access to dashboard and analytics',
    isSystem: true,
    color: '#9ca3af',
    permissions: [
      'news.read', 'gallery.read', 'video.read', 'blogs.read',
      'campaigns.read', 'events.read', 'downloads.read',
      'analytics.view',
    ],
  },
]

async function seed() {
  await connectDB()
  console.log('Connected to MongoDB\n')

  // Seed roles
  console.log('Seeding roles...')
  const roleMap = {}
  for (const roleData of ROLES) {
    const role = await Role.findOneAndUpdate(
      { slug: roleData.slug },
      { $set: roleData },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )
    roleMap[roleData.slug] = role._id
    console.log(`  ✓ ${roleData.name}`)
  }

  // Seed Super Admin user
  const username = process.env.SEED_ADMIN_USERNAME || 'admin'
  const password = process.env.SEED_ADMIN_PASSWORD || 'Admin@123'

  console.log('\nSeeding Super Admin user...')
  const existing = await User.findOne({ username })
  if (!existing) {
    await User.create({
      name: 'Super Admin',
      username,
      password,
      roleId: roleMap['super-admin'],
      permissions: [],
      isActive: true,
    })
    console.log(`  ✓ Created user: ${username}`)
  } else {
    console.log(`  - User already exists: ${username}`)
  }

  // Seed SiteConfig singleton
  console.log('\nSeeding SiteConfig...')
  const existingConfig = await SiteConfig.findOne()
  if (!existingConfig) {
    await SiteConfig.create({})
    console.log('  ✓ SiteConfig created with defaults')
  } else {
    console.log('  - SiteConfig already exists')
  }

  console.log('\nSeed complete.')
  process.exit(0)
}

seed().catch((err) => {
  console.error('\nSeed failed:', err.message)
  process.exit(1)
})
