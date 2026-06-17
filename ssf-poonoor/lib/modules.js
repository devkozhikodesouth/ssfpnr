// Server-side registry of the 7 soft-deletable content modules. Single source
// of truth for the trash system (list/restore/purge) and Cloudinary cleanup —
// so adding a module means adding one entry here, not editing every route.

const News = require('../models/News')
const Blog = require('../models/Blog')
const Video = require('../models/Video')
const Gallery = require('../models/Gallery')
const Campaign = require('../models/Campaign')
const Event = require('../models/Event')
const Download = require('../models/Download')

const MODULES = {
  news: {
    Model: News,
    label: 'News',
    titleField: 'title',
    assets: { assetFields: ['image'] },
  },
  gallery: {
    Model: Gallery,
    label: 'Gallery',
    titleField: 'title',
    assets: { assetFields: ['coverImage'], imageArrayFields: ['images'] },
  },
  video: {
    Model: Video,
    label: 'Video',
    titleField: 'title',
    assets: { assetFields: ['thumbnail'] },
  },
  blogs: {
    Model: Blog,
    label: 'Blogs',
    titleField: 'title',
    assets: { assetFields: ['image'] },
  },
  campaigns: {
    Model: Campaign,
    label: 'Campaigns',
    titleField: 'title',
    assets: { assetFields: ['bannerImage'] },
  },
  events: {
    Model: Event,
    label: 'Events',
    titleField: 'title',
    assets: { assetFields: ['image'] },
  },
  downloads: {
    Model: Download,
    label: 'Downloads',
    titleField: 'name',
    assets: { rawFields: ['file'] },
  },
}

const MODULE_KEYS = Object.keys(MODULES)

function getModule(key) {
  return MODULES[key] || null
}

module.exports = { MODULES, MODULE_KEYS, getModule }
