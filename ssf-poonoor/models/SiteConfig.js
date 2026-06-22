const mongoose = require('mongoose')

const moduleConfigSchema = new mongoose.Schema(
  {
    enabled: { type: Boolean, default: true },
    label: { type: String },
    labelMl: { type: String },
    perPage: { type: Number, default: 12 },
    defaultSort: { type: String, default: 'publishedAt-desc' },
    showOnHome: { type: Boolean, default: true },
    homeLimit: { type: Number, default: 3 },
    navOrder: { type: Number },
    cardStyle: { type: String },
    showCategory: { type: Boolean, default: true },
    showAuthor: { type: Boolean, default: true },
    showReadTime: { type: Boolean, default: false },
    enableSharing: { type: Boolean, default: true },
  },
  { _id: false }
)

const homepageSectionSchema = new mongoose.Schema(
  {
    type: { type: String },
    enabled: { type: Boolean, default: true },
    order: { type: Number },
    config: { type: mongoose.Schema.Types.Mixed },
  },
  { _id: false }
)

const bottomNavItemSchema = new mongoose.Schema(
  {
    label: { type: String },
    icon: { type: String },
    path: { type: String },
  },
  { _id: false }
)

// Reusable CTA button shape used by the website builder (header, footer, and the
// homepage section blocks store CTAs in their Mixed `config`, but header/footer
// CTAs are typed here so they persist reliably).
const ctaSchema = new mongoose.Schema(
  {
    enabled: { type: Boolean, default: false },
    text: { type: String, default: '' },
    url: { type: String, default: '' },
    bgColor: { type: String, default: '#1a6b47' },
    textColor: { type: String, default: '#ffffff' },
  },
  { _id: false }
)

// Per-page chrome visibility (Website Builder → Layout). Lets specific screens
// drop the header and/or footer so their content can sit edge-to-edge.
const chromePageSchema = new mongoose.Schema(
  {
    label: { type: String },
    path: { type: String },
    hideHeader: { type: Boolean, default: false },
    hideFooter: { type: Boolean, default: false },
  },
  { _id: false }
)

const siteConfigSchema = new mongoose.Schema({
  branding: {
    siteName: { type: String, default: 'SSF Poonoor' },
    tagline: { type: String },
    logo: { type: String },
    logoLight: { type: String },
    logoDark: { type: String },
    favicon: { type: String },
    ogDefaultImage: { type: String },
  },
  theme: {
    primaryColor: { type: String, default: '#1a6b47' },
    secondaryColor: { type: String, default: '#0f4a30' },
    accentColor: { type: String, default: '#c9a84c' },
    backgroundDark: { type: String, default: '#141414' },
    backgroundLight: { type: String, default: '#ffffff' },
    textPrimary: { type: String, default: '#1a1a1a' },
    textSecondary: { type: String, default: '#6b7280' },
    headingFont: { type: String, default: 'Inter' },
    bodyFont: { type: String, default: 'Inter' },
    arabicFont: { type: String, default: 'Inter' },
    fontSize: {
      base: { type: String, default: '16px' },
      scale: { type: Number, default: 1.25 },
    },
  },
  // Website-builder header controls (colors, logo, CTA). Navigation *links* are
  // still managed in path-manage / mobile.bottomNavItems; this is presentation.
  header: {
    bgColor: { type: String, default: '#141414' },
    textColor: { type: String, default: '#e5e7eb' },
    activeColor: { type: String, default: '#c9a84c' },
    activeTextColor: { type: String, default: '#ffffff' },
    logoType: { type: String, default: 'image', enum: ['image', 'text'] },
    logoWidth: { type: Number, default: 160 },
    logoUrl: { type: String, default: '' },
    cta: { type: ctaSchema, default: () => ({ enabled: true, text: 'Donate', url: '', bgColor: '#1a6b47', textColor: '#ffffff' }) },
  },
  // Per-page header/footer visibility. `pages` is matched against the current
  // pathname (exact for '/', prefix for the rest); the most specific match wins.
  chrome: {
    pages: {
      type: [chromePageSchema],
      default: () => [
        { label: 'Home', path: '/', hideHeader: false, hideFooter: false },
        { label: 'About', path: '/about', hideHeader: false, hideFooter: false },
        { label: 'News', path: '/news', hideHeader: false, hideFooter: false },
        { label: 'Gallery', path: '/gallery', hideHeader: false, hideFooter: false },
        { label: 'Videos', path: '/video', hideHeader: false, hideFooter: false },
        { label: 'Events', path: '/events', hideHeader: false, hideFooter: false },
        { label: 'Blogs', path: '/blogs', hideHeader: false, hideFooter: false },
        { label: 'Campaigns', path: '/campaigns', hideHeader: false, hideFooter: false },
        { label: 'Downloads', path: '/downloads', hideHeader: false, hideFooter: false },
      ],
    },
  },
  layout: {
    headerStyle: { type: String, default: 'classic', enum: ['classic', 'minimal', 'centered'] },
    footerStyle: { type: String, default: 'classic', enum: ['classic', 'minimal', 'expanded'] },
    cardStyle: { type: String, default: 'shadow', enum: ['shadow', 'border', 'flat'] },
    radius: { type: String, default: 'soft', enum: ['sharp', 'soft', 'pill'] },
  },
  modules: {
    news: { type: moduleConfigSchema, default: () => ({ label: 'News', labelMl: 'വാർത്തകൾ', navOrder: 1, showReadTime: true }) },
    gallery: { type: moduleConfigSchema, default: () => ({ label: 'Gallery', labelMl: 'ഗാലറി', navOrder: 2, showAuthor: false }) },
    video: { type: moduleConfigSchema, default: () => ({ label: 'Videos', labelMl: 'വീഡിയോ', navOrder: 3, showAuthor: false }) },
    blogs: { type: moduleConfigSchema, default: () => ({ label: 'Blogs', labelMl: 'ബ്ലോഗ്', navOrder: 4, showReadTime: true }) },
    campaigns: { type: moduleConfigSchema, default: () => ({ label: 'Campaigns', labelMl: 'കാമ്പെയ്‌നുകൾ', navOrder: 5, showAuthor: false }) },
    events: { type: moduleConfigSchema, default: () => ({ label: 'Events', labelMl: 'ഇവന്റുകൾ', navOrder: 6, showAuthor: false }) },
    downloads: { type: moduleConfigSchema, default: () => ({ label: 'Downloads', labelMl: 'ഡൗൺലോഡ്', navOrder: 7, showAuthor: false }) },
  },
  homepage: {
    sections: {
      type: [homepageSectionSchema],
      default: () => [
        { type: 'hero', enabled: true, order: 1 },
        { type: 'live', enabled: false, order: 2, config: { eyebrow: 'Streaming Now', title: 'Live' } },
        { type: 'about', enabled: true, order: 3 },
        { type: 'campaigns', enabled: true, order: 4, config: { limit: 4 } },
        { type: 'news', enabled: true, order: 5, config: { limit: 3 } },
        { type: 'videos', enabled: true, order: 6, config: { limit: 3 } },
        { type: 'gallery', enabled: true, order: 7, config: { limit: 8 } },
        { type: 'blogs', enabled: true, order: 8, config: { limit: 3 } },
        { type: 'events', enabled: true, order: 9, config: { limit: 4 } },
        { type: 'newsletter', enabled: false, order: 10 },
      ],
    },
  },
  seo: {
    defaultTitle: { type: String, default: 'SSF Poonoor' },
    titleTemplate: { type: String, default: '%s | SSF Poonoor' },
    defaultDescription: { type: String },
    defaultKeywords: [{ type: String }],
    googleAnalyticsId: { type: String },
    googleSearchConsoleId: { type: String },
    facebookAppId: { type: String },
    twitterHandle: { type: String },
    sitemapEnabled: { type: Boolean, default: true },
    robotsTxtCustom: { type: String },
  },
  social: {
    facebook: { type: String },
    instagram: { type: String },
    youtube: { type: String },
    twitter: { type: String },
    telegram: { type: String },
    whatsapp: { type: String },
  },
  contact: {
    email: { type: String },
    phone: { type: String },
    address: { type: String },
    mapLink: { type: String },
  },
  footer: {
    text: { type: String },
    textMl: { type: String },
    copyright: { type: String, default: '© SSF Poonoor Division. All rights reserved.' },
    bgColor: { type: String, default: '#141414' },
    cta: { type: ctaSchema, default: () => ({ enabled: false }) },
  },
  // Fully editable About page (Website Builder → About Page). Every section's
  // copy, colours and lists are data-driven; the public /about page falls back to
  // sensible defaults when a field is blank.
  about: {
    hero: {
      eyebrow: { type: String, default: 'About Us' },
      title: { type: String },
      subtitle: { type: String },
      description: { type: String },
      bgColor: { type: String, default: '#141414' },
      cta: { type: ctaSchema, default: () => ({ enabled: false }) },
      typography: { type: mongoose.Schema.Types.Mixed },
    },
    missionVision: {
      bgColor: { type: String, default: '#ffffff' },
      mission: {
        eyebrow: { type: String, default: 'Our Mission' },
        title: { type: String, default: 'Empowering Students' },
        text: { type: String },
      },
      vision: {
        eyebrow: { type: String, default: 'Our Vision' },
        title: { type: String, default: 'A Knowledge Community' },
        text: { type: String },
      },
    },
    pillars: {
      eyebrow: { type: String, default: 'What We Do' },
      title: { type: String, default: 'Our Pillars' },
      bgColor: { type: String, default: '#f8fafc' },
      items: {
        type: [new mongoose.Schema({ title: String, icon: String }, { _id: false })],
        default: undefined,
      },
    },
    leadership: {
      eyebrow: { type: String, default: 'Our Team' },
      title: { type: String, default: 'Leadership' },
      bgColor: { type: String, default: '#ffffff' },
      items: {
        type: [new mongoose.Schema({ name: String, role: String, photo: String }, { _id: false })],
        default: undefined,
      },
    },
    wings: {
      eyebrow: { type: String, default: 'Portfolios' },
      title: { type: String, default: 'Wings & Initiatives' },
      bgColor: { type: String, default: '#f8fafc' },
      items: {
        type: [new mongoose.Schema({ name: String, desc: String }, { _id: false })],
        default: undefined,
      },
    },
  },
  mobile: {
    bottomNavEnabled: { type: Boolean, default: true },
    bottomNavItems: {
      type: [bottomNavItemSchema],
      default: () => [
        { label: 'Home', icon: 'home', path: '/' },
        { label: 'News', icon: 'newspaper', path: '/news' },
        { label: 'Gallery', icon: 'image', path: '/gallery' },
        { label: 'More', icon: 'menu', path: '#menu' },
      ],
    },
  },
  performance: {
    enableISR: { type: Boolean, default: true },
    revalidateSeconds: { type: Number, default: 60 },
    imageQuality: { type: Number, default: 75 },
    lazyLoadImages: { type: Boolean, default: true },
  },
})

const SiteConfig = mongoose.models.SiteConfig || mongoose.model('SiteConfig', siteConfigSchema)

module.exports = SiteConfig
