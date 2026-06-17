# SSF Poonoor Division — Master Project Plan
> **Reference Site:** [ssfkerala.org](https://ssfkerala.org/)
> **Stack:** Next.js (App Router) · JavaScript · Tailwind CSS · MongoDB (Mongoose) · NextAuth.js · Cloudinary
> **Scope:** Mobile-first public portal + multi-role admin CMS with full configurability

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack Architecture](#2-tech-stack-architecture)
3. [Folder Structure](#3-folder-structure)
4. [Role & Permission System](#4-role--permission-system)
5. [Category Architecture (Cross-Module Backbone)](#5-category-architecture-cross-module-backbone)
6. [Soft Delete System](#6-soft-delete-system)
7. [Database Schemas (MongoDB)](#7-database-schemas-mongodb)
8. [Authentication](#8-authentication)
9. [Site Setup & Full Configurability](#9-site-setup--full-configurability)
10. [Custom Font Upload System](#10-custom-font-upload-system)
11. [Per-Item Custom CSS](#11-per-item-custom-css)
12. [Sorting & Filtering System](#12-sorting--filtering-system)
13. [SEO Architecture](#13-seo-architecture)
14. [Mobile-First UI Strategy](#14-mobile-first-ui-strategy)
15. [Public Pages Specification](#15-public-pages-specification)
16. [Admin Panel Specification](#16-admin-panel-specification)
17. [API Routes Design](#17-api-routes-design)
18. [Media & File Management](#18-media--file-management)
19. [UI/UX Design Guidelines](#19-uiux-design-guidelines)
20. [Development Phases & Milestones](#20-development-phases--milestones)
21. [Deployment Strategy](#21-deployment-strategy)
22. [Non-Functional Requirements](#22-non-functional-requirements)
23. [Summary Checklist](#23-summary-checklist)

---

## 1. Project Overview

**Organization:** SSF Poonoor Division (Sunni Student Federation)

**Purpose:** A public-facing web portal that mirrors SSF Kerala's branding and serves news, events, campaigns, gallery, videos, blogs, and downloads for the Poonoor Division. An integrated, multi-role admin CMS allows different managers (Site, Media, Content, Program) to manage their respective content scopes.

**Key Goals:**
- Publish timely news, events, campaigns in Malayalam & English
- Showcase gallery images and YouTube video collections
- Provide downloadable resources (PDFs, documents)
- Enable full CMS control through a protected, role-scoped admin panel
- Allow dynamic site configuration (theme, logo, fonts, navbar, footer, modules) without code changes
- Cross-link related content via shared categories (one event surfaces its news, videos, gallery together)
- Mobile-first experience with PWA capabilities
- Enterprise-grade SEO and performance

---

## 2. Tech Stack Architecture

```
┌─────────────────────────────────────────────────────┐
│                  NEXT.JS APP ROUTER                 │
│                                                     │
│  ┌─────────────────┐    ┌──────────────────────┐    │
│  │  Public Pages   │    │   Admin Panel /app/  │    │
│  │  (/)            │    │  (NextAuth + roles)  │    │
│  └────────┬────────┘    └──────────┬───────────┘    │
│           │                        │                │
│           └──────────┬─────────────┘                │
│                      │                              │
│              Next.js API Routes                     │
│              /api/*  (REST, RBAC enforced)          │
│                      │                              │
└──────────────────────┼──────────────────────────────┘
                       │
       ┌───────────────┼───────────────┐
       │               │               │
┌──────┴──────┐ ┌──────┴──────┐ ┌──────┴──────┐
│  MongoDB    │ │  Cloudinary │ │   Vercel    │
│  (Mongoose) │ │ (media CDN) │ │  (hosting)  │
└─────────────┘ └─────────────┘ └─────────────┘
```

### Package Summary

| Purpose | Package |
|---|---|
| Framework | next@14+ |
| Auth | next-auth@4 |
| DB ODM | mongoose |
| Styling | tailwindcss, clsx |
| Rich Text Editor | @tiptap/react |
| CSS Editor (admin) | @uiw/react-codemirror |
| Image Optimization | next/image |
| Media Upload | multer + Cloudinary SDK |
| Form Handling | react-hook-form |
| Validation | zod |
| Date Handling | date-fns |
| Icons | lucide-react |
| Toast Notifications | react-hot-toast |
| OG Image Generation | @vercel/og |
| CSS Sanitization | dompurify, postcss |
| Drag & Drop | @dnd-kit/sortable |

---

## 3. Folder Structure

```
ssf-poonoor/
├── app/
│   ├── (public)/                       # Public route group
│   │   ├── page.jsx                    # Home /
│   │   ├── about/page.jsx
│   │   ├── news/
│   │   │   ├── page.jsx                # News list
│   │   │   └── [slug]/page.jsx         # News detail
│   │   ├── gallery/
│   │   │   ├── page.jsx
│   │   │   └── [slug]/page.jsx
│   │   ├── video/
│   │   │   ├── page.jsx
│   │   │   └── [slug]/page.jsx
│   │   ├── blogs/
│   │   │   ├── page.jsx
│   │   │   └── [slug]/page.jsx
│   │   ├── campaigns/
│   │   │   ├── page.jsx
│   │   │   └── [slug]/page.jsx
│   │   ├── events/
│   │   │   ├── page.jsx
│   │   │   └── [slug]/page.jsx
│   │   ├── downloads/page.jsx
│   │   └── c/[slug]/page.jsx           # Standalone category page
│   │
│   ├── app/                             # Admin route group
│   │   ├── login/page.jsx
│   │   ├── dashboard/page.jsx
│   │   ├── news/page.jsx
│   │   ├── gallery/page.jsx
│   │   ├── video/page.jsx
│   │   ├── blogs/page.jsx
│   │   ├── campaigns/page.jsx
│   │   ├── events/page.jsx
│   │   ├── downloads/page.jsx
│   │   ├── categories/page.jsx         # Cross-module categories
│   │   ├── users/page.jsx
│   │   ├── roles/page.jsx              # Role & permission mgmt
│   │   ├── fonts/page.jsx              # Custom font upload
│   │   ├── trash/page.jsx              # Soft-deleted items
│   │   ├── path-manage/page.jsx
│   │   ├── site-setup/page.jsx
│   │   └── analytics/page.jsx
│   │
│   ├── api/
│   │   ├── auth/[...nextauth]/route.js
│   │   ├── news/route.js, [id]/route.js
│   │   ├── gallery/route.js, [id]/route.js
│   │   ├── video/route.js, [id]/route.js
│   │   ├── blogs/route.js, [id]/route.js
│   │   ├── campaigns/route.js, [id]/route.js
│   │   ├── events/route.js, [id]/route.js
│   │   ├── downloads/route.js, [id]/route.js
│   │   ├── categories/route.js, [id]/route.js
│   │   ├── c/[slug]/route.js           # Aggregated category data
│   │   ├── users/route.js, [id]/route.js
│   │   ├── roles/route.js, [id]/route.js
│   │   ├── fonts/route.js, [id]/route.js
│   │   ├── trash/
│   │   │   ├── route.js                # List all trash
│   │   │   └── [module]/[id]/
│   │   │       ├── restore/route.js
│   │   │       └── purge/route.js
│   │   ├── site-config/route.js
│   │   ├── nav-paths/route.js, [id]/route.js
│   │   ├── upload/route.js
│   │   ├── analytics/summary/route.js
│   │   └── seo/og-image/route.js       # Dynamic OG image
│   │
│   ├── sitemap.xml/route.js
│   ├── robots.txt/route.js
│   └── manifest.json                   # PWA
│
├── components/
│   ├── public/
│   │   ├── layout/                     # Navbar, Footer, BottomNav, MobileMenu
│   │   ├── home/                       # Hero, AboutSection, ModuleSection
│   │   ├── cards/                      # NewsCard, GalleryCard, BlogCard, etc.
│   │   ├── filters/                    # FilterBottomSheet, SortDropdown
│   │   ├── category/                   # CategoryPage, CategoryTabs
│   │   └── seo/                        # SeoMeta, JsonLd
│   │
│   ├── admin/
│   │   ├── layout/                     # AdminShell, Sidebar, MobileDrawer
│   │   ├── tables/                     # DataTable, MobileCardList
│   │   ├── forms/                      # ItemForm, CategoryForm, FontUploader
│   │   ├── editor/                     # RichTextEditor, CssEditor
│   │   └── widgets/                    # StatsCard, RecentActivity
│   │
│   └── shared/
│       ├── ImageUploader.jsx
│       ├── Lightbox.jsx
│       ├── ThemeInjector.jsx
│       ├── FontInjector.jsx
│       └── LoadingSpinner.jsx
│
├── lib/
│   ├── db.js                           # MongoDB connection
│   ├── auth.js                         # NextAuth config
│   ├── cloudinary.js
│   ├── permissions.js                  # Permission resolver
│   ├── softDelete.js                   # Mongoose plugin
│   ├── seo.js                          # Meta + JSON-LD helpers
│   ├── cssSanitizer.js                 # CSS safety
│   └── fontLoader.js
│
├── models/
│   ├── plugins/
│   │   ├── softDeletePlugin.js
│   │   ├── seoSchema.js
│   │   └── auditSchema.js
│   ├── News.js
│   ├── Gallery.js
│   ├── Video.js
│   ├── Blog.js
│   ├── Campaign.js
│   ├── Event.js
│   ├── Download.js
│   ├── Category.js
│   ├── Font.js
│   ├── User.js
│   ├── Role.js
│   ├── SiteConfig.js
│   ├── NavPath.js
│   └── AuditLog.js
│
├── middleware.js                        # Auth protection for /app/*
├── tailwind.config.js
├── next.config.js
├── .env.local
└── package.json
```

---

## 4. Role & Permission System

### 4.1 Roles

| Role | Description | Default Scope |
|---|---|---|
| **Super Admin** | System owner | Everything: all CRUD + users + roles + site setup |
| **Site Manager** | Site appearance & structure | Site Setup, Path Manage, Categories, Theme, Fonts |
| **Media Manager** | Visual content | Gallery, Video, Downloads CRUD |
| **Content Manager** | Written content | News, Blogs CRUD |
| **Program Manager** | Events & campaigns | Events, Campaigns CRUD |
| **Editor** | Drafts only | Can create drafts; cannot publish |
| **Viewer** | Read-only | Dashboard + analytics |

Custom roles can be defined by Super Admin.

### 4.2 Granular Permission Strings

Stored as an array on each user. Atomic strings:

```
news.create     news.read       news.update       news.delete       news.publish      news.custom-css
gallery.create  gallery.read    gallery.update    gallery.delete    gallery.publish
video.create    video.read      video.update      video.delete      video.publish     video.custom-css
blogs.create    blogs.read      blogs.update      blogs.delete      blogs.publish     blogs.custom-css
campaigns.*     events.*        downloads.*
categories.manage
users.manage    roles.manage
site.configure  fonts.upload    paths.manage
trash.view      trash.restore   trash.purge
analytics.view
```

### 4.3 Permission Resolution

```
1. Each role has a default permission preset
2. Super Admin can override individual user permissions
3. Resolved permission set = role defaults + user overrides
4. API routes check req.user.permissions.includes('news.create')
5. UI hides buttons/sections the user lacks permission for
```

### 4.4 Role Permission Matrix (Defaults)

| Permission | Super | Site Mgr | Media Mgr | Content Mgr | Program Mgr | Editor | Viewer |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| News CRUD + publish | ✅ | – | – | ✅ | – | draft | view |
| Blogs CRUD + publish | ✅ | – | – | ✅ | – | draft | view |
| Gallery CRUD | ✅ | – | ✅ | – | – | draft | view |
| Video CRUD | ✅ | – | ✅ | – | – | draft | view |
| Downloads CRUD | ✅ | – | ✅ | – | – | draft | view |
| Campaigns CRUD | ✅ | – | – | – | ✅ | draft | view |
| Events CRUD | ✅ | – | – | – | ✅ | draft | view |
| Categories | ✅ | ✅ | – | – | – | – | – |
| Custom CSS per item | ✅ | – | – | grant | – | – | – |
| Site Setup | ✅ | ✅ | – | – | – | – | – |
| Fonts upload | ✅ | ✅ | – | – | – | – | – |
| Path manage | ✅ | ✅ | – | – | – | – | – |
| User management | ✅ | – | – | – | – | – | – |
| Role management | ✅ | – | – | – | – | – | – |
| Trash restore | ✅ | – | own | own | own | – | – |
| Analytics | ✅ | ✅ | ✅ | ✅ | ✅ | – | ✅ |

### 4.5 Role Management UI `/app/roles`

- List of roles with their permission preset
- Super Admin can create custom roles
- Visual permission grid: rows = modules, columns = actions, click to toggle
- Assign role to user OR override permissions individually

---

## 5. Category Architecture (Cross-Module Backbone)

The biggest structural decision: **categories are a shared collection** that any content type can reference. This enables one event like "Sahityotsav 26" to gather news + videos + gallery + blogs under one umbrella.

### 5.1 Concept

```
Category: "Sahityotsav 26"  (type: event-based, standalone: true)
    ├── News      → 12 items tagged with this category
    ├── Videos    → 5 items
    ├── Gallery   → 1 album with 40 photos
    ├── Blogs     → 3 posts
    └── Events    → 1 entry

→ Public visits /c/sahityotsav-26 → sees ALL of this on one page with tabs.
→ Optionally appears as standalone item in the navbar.
```

### 5.2 Category Types

| Type | Use | Examples |
|---|---|---|
| **event-based** | Tied to a specific event/campaign; can be standalone | Sahityotsav 26, Sensorium 26, Vertex, Zest 2026 |
| **topical** | General subject tags | Education, Environment, Cultural, Political |
| **permanent** | System-level | Press Meet, Announcement, General, Circular |

### 5.3 Pre-Seeded Categories

**Event-based (standalone candidates):**
Sahityotsav 26 · Sensorium 26 · Vertex · Zest 2026 · Thartheel · Kuttithottam · Human Library

**Topical:**
General · Education · Environment · Cultural · Political · Spiritual · Ahlussunna Talk · Risala Decode

**Permanent:**
Announcement · Press Meet · Circular · Report

### 5.4 Cross-Module Reference

Every content model carries:
```
categoryId             ObjectId   Ref: categories (primary)
secondaryCategories    Array      Optional tags
```

### 5.5 Standalone Category Pages

When `isStandalone: true`, the category gets:
- **Public URL:** `/c/[slug]` (e.g., `/c/sahityotsav-26`)
- **Layout:** Banner header + tabs for News | Videos | Gallery | Blogs | Events
- **Navbar entry:** Added if `isFeatured: true`
- **SEO:** Custom meta, OG image (the cover)
- **Aggregated API:** `/api/c/[slug]` returns all linked content in one call

### 5.6 Category Admin UI `/app/categories`

- Sortable table: name, type, applicable modules, linked content count, status
- Form fields: name, slug, type, modules (multi-select), color picker, cover image, parent (for nesting), `isStandalone`, `isFeatured`
- "Linked Content" tab per category shows all items across modules
- Drag-to-reorder
- Tree view for nested categories (e.g., Sensorium → Sensorium 2026)

---

## 6. Soft Delete System

### 6.1 Universal Application

Every content collection gets these fields via a Mongoose plugin:

```
isDeleted       Boolean   Default: false
deletedAt       Date      Set on soft delete
deletedBy       ObjectId  User who deleted
deleteReason    String    Optional
```

### 6.2 Query Behavior

```
- Default query injects { isDeleted: false } automatically
- Admin "Trash" view passes { isDeleted: true } explicitly
- Public API ALWAYS filters out deleted (cannot be overridden)
```

### 6.3 Trash Page `/app/trash`

- Tabs per module (News | Gallery | Video | Blogs | Campaigns | Events | Downloads)
- Each item shows: title, deletedAt, deletedBy, restore button, permanent-delete button
- Bulk select for restore/purge
- Auto-purge rule (configurable): items in trash > 30 days auto-removed

### 6.4 Operation Matrix

| Action | Effect |
|---|---|
| Delete (admin UI) | Soft delete: `isDeleted=true`, kept in DB |
| Restore from trash | `isDeleted=false`, item returns to active state |
| Permanent delete | Actual DB removal + Cloudinary asset removal |
| Cascade behavior | Deleting a category does NOT cascade. Items keep `categoryId`; if category is deleted, items display "Uncategorized" |

### 6.5 Permissions

- Standard users can restore items they themselves deleted
- Super Admin can restore/purge anything
- Permanent purge always requires Super Admin

---

## 7. Database Schemas (MongoDB)

### 7.1 Shared Schema Components

Every content model includes these embedded sub-schemas:

```
seo: {
  metaTitle: String,
  metaDescription: String,
  metaKeywords: [String],
  ogImage: String,
  canonicalUrl: String,
  noIndex: Boolean,
  structuredData: Object        // custom JSON-LD override
}

visibility: {
  isPublished: Boolean,
  publishAt: Date,              // scheduled publish
  unpublishAt: Date,
  isPinned: Boolean,            // pinned to top of lists
  isFeatured: Boolean           // featured on homepage
}

sort: {
  sortOrder: Number,            // manual drag-to-order
  weight: Number                // algorithmic ranking
}

audit: {
  createdBy: ObjectId,
  updatedBy: ObjectId,
  createdAt: Date,
  updatedAt: Date,
  publishedAt: Date,
  version: Number               // increments on each update
}

softDelete: { isDeleted, deletedAt, deletedBy, deleteReason }
```

### 7.2 Category
```
Collection: categories
─────────────────────────────────────────────────
Field            Type       Notes
─────────────────────────────────────────────────
_id              ObjectId
name             String     e.g. "Sahityotsav 26"
slug             String     Unique
description      String
coverImage       String     Banner for category page
icon             String     Optional icon URL
color            String     Hex for badge
type             Enum       'event-based' | 'topical' | 'permanent'
appliesTo        [String]   ['news','video','gallery','blog',
                            'event','campaign','download']
isStandalone     Boolean    If true → /c/[slug] page
parentId         ObjectId   Optional, for nesting
order            Number
isFeatured       Boolean    Highlight on homepage / navbar
+ visibility, audit, softDelete
─────────────────────────────────────────────────
```

### 7.3 News
```
title, slug, image, content, excerpt
categoryId, secondaryCategories[]
language: 'ml' | 'en' | 'both'
readTime: Number               (auto-calculated)
author: { name, role, image }
customCss: String              (scoped per-item)
viewCount: Number
+ seo, visibility, sort, audit, softDelete
```

### 7.4 Gallery
```
title, slug
images: [{ url, caption, alt, order }]    // album as array
coverImage: String
categoryId, secondaryCategories[]
albumType: 'single' | 'album'
viewCount: Number
+ seo, visibility, sort, audit, softDelete
```

### 7.5 Video
```
title, slug, youTubeLink, thumbnail
description, transcript
categoryId, secondaryCategories[]
speakers: [{ name, role }]
duration: String
customCss: String
viewCount: Number
+ seo, visibility, sort, audit, softDelete
```

### 7.6 Blog
```
title, slug, image, content, excerpt
author: { name, role, image, bio }
categoryId, secondaryCategories[]
tags: [String]
readTime: Number
customCss: String
viewCount: Number
+ seo, visibility, sort, audit, softDelete
```

### 7.7 Campaign
```
title, slug, bannerImage, content
categoryId
fromDate, toDate, isActive
linkedItems: {
  news: [ObjectId],
  videos: [ObjectId],
  gallery: [ObjectId],
  blogs: [ObjectId]
}
+ seo, visibility, sort, audit, softDelete
```

### 7.8 Event
```
title, slug, image, content
fromDate, toDate, location, venue
status: 'upcoming' | 'ongoing' | 'past'    (auto-computed)
categoryId
registrationLink, capacity
linkedItems: { news, videos, gallery, blogs }
+ seo, visibility, sort, audit, softDelete
```

### 7.9 Download
```
name, file, fileType, fileSize
categoryId
downloadCount: Number
requiresAuth: Boolean
+ seo, visibility, sort, audit, softDelete
```

### 7.10 User
```
name, username, email, phone
password (bcrypt, 12 rounds)
roleId: ObjectId (ref: roles)
permissions: [String]          // overrides role defaults
avatar: String
isActive: Boolean
lastLogin: Date
+ audit, softDelete
```

### 7.11 Role
```
name, slug, description
permissions: [String]
isSystem: Boolean              // cannot be deleted if true
color: String
+ audit
```

### 7.12 Font
```
name, slug
files: { woff2, woff, ttf }
weights: [Number]              // [300, 400, 500, 700]
styles: ['normal', 'italic']
isActive: Boolean
assignedTo: ['heading','body','arabic']   // role(s) in the site
uploadedBy: ObjectId
+ audit
```

### 7.13 SiteConfig (Singleton)
See Section 9 for the full structure.

### 7.14 NavPath
```
label, labelMl, path, order
isVisible, isExternal
icon, parent (for dropdowns)
location: 'top-nav' | 'bottom-nav' | 'footer'
+ audit
```

### 7.15 AuditLog
```
userId, action, module, itemId
before: Object, after: Object
ipAddress, userAgent
createdAt
```

---

## 8. Authentication

### 8.1 Auth Flow

```
User visits /app/*
    → middleware.js checks NextAuth session
    → No session → redirect to /app/login
    → Has session → check role permissions for route
    → Render admin panel
```

### 8.2 Credentials Setup

- Provider: NextAuth Credentials Provider
- Login fields: `username` + `password`
- Password hashing: bcrypt, salt rounds 12
- Session strategy: JWT in HTTP-only cookie
- Session payload: `{ id, name, roleId, permissions[] }`
- Session timeout: 24 hours

### 8.3 Middleware Protection

```
Matcher: /app/:path*  (except /app/login)
- Validates NextAuth JWT
- Redirects unauthenticated → /app/login
- API routes additionally check req.user.permissions per endpoint
```

---

## 9. Site Setup & Full Configurability

### 9.1 Configuration Layers (top wins)

```
1. Per-Item Override        (custom CSS on a single article)
        ↓
2. Per-Category Override    (category-specific accent)
        ↓
3. Per-Module Config        (site_config.modules.news.cardStyle)
        ↓
4. Global Site Config       (theme, fonts)
        ↓
5. System Defaults          (fallback)
```

### 9.2 SiteConfig Document Structure

```
{
  branding: {
    siteName, tagline, logo, logoLight, logoDark,
    favicon, ogDefaultImage
  },

  theme: {
    primaryColor, secondaryColor, accentColor,
    backgroundDark, backgroundLight,
    textPrimary, textSecondary,
    headingFont,     // refs Font._id or Google Font name
    bodyFont,
    arabicFont,
    fontSize: { base, scale }
  },

  layout: {
    headerStyle:  'classic' | 'minimal' | 'centered',
    footerStyle:  'classic' | 'minimal' | 'expanded',
    cardStyle:    'shadow'  | 'border'  | 'flat',
    radius:       'sharp'   | 'soft'    | 'pill'
  },

  modules: {
    news: {
      enabled: true,
      label: 'News', labelMl: 'വാർത്തകൾ',
      perPage: 12,
      defaultSort: 'publishedAt-desc',
      showOnHome: true,
      homeLimit: 3,
      navOrder: 1,
      cardStyle: 'detailed',
      showCategory: true,
      showAuthor: true,
      showReadTime: true,
      enableSharing: true
    },
    gallery: { /* similar */ },
    video:   { /* similar */ },
    blogs:   { /* similar */ },
    campaigns: { /* similar */ },
    events:    { /* similar */ },
    downloads: { /* similar */ }
  },

  homepage: {
    sections: [
      { type: 'hero',       enabled: true, order: 1, config: {...} },
      { type: 'about',      enabled: true, order: 2 },
      { type: 'campaigns',  enabled: true, order: 3, limit: 4 },
      { type: 'news',       enabled: true, order: 4, limit: 3 },
      { type: 'videos',     enabled: true, order: 5, limit: 3 },
      { type: 'gallery',    enabled: true, order: 6, limit: 8 },
      { type: 'blogs',      enabled: true, order: 7, limit: 3 },
      { type: 'events',     enabled: true, order: 8, limit: 4 },
      { type: 'newsletter', enabled: false, order: 9 }
    ]
    // Drag-to-reorder in admin UI
  },

  seo: {
    defaultTitle, titleTemplate,        // e.g. "%s | SSF Poonoor"
    defaultDescription, defaultKeywords,
    googleAnalyticsId, googleSearchConsoleId,
    facebookAppId, twitterHandle,
    sitemapEnabled, robotsTxtCustom
  },

  social: {
    facebook, instagram, youtube, twitter, telegram, whatsapp
  },

  contact: { email, phone, address, mapLink },

  mobile: {
    bottomNavEnabled: true,
    bottomNavItems: [
      { label: 'Home',    icon: 'home',      path: '/' },
      { label: 'News',    icon: 'newspaper', path: '/news' },
      { label: 'Gallery', icon: 'image',     path: '/gallery' },
      { label: 'More',    icon: 'menu',      path: '#menu' }
    ]
  },

  performance: {
    enableISR: true,
    revalidateSeconds: 60,
    imageQuality: 75,
    lazyLoadImages: true
  }
}
```

### 9.3 Site Setup UI `/app/site-setup` — Tabs

| Tab | Sections |
|---|---|
| **Branding** | Site name, taglines, logos (light/dark), favicon, OG default image |
| **Theme** | Colors (picker), layout style, card style, border radius |
| **Fonts** | Upload custom fonts, manage active font, assign roles |
| **Homepage** | Drag-to-reorder homepage sections, per-section config |
| **Modules** | Per-module enable/disable + behavior settings |
| **Navigation** | Top nav, mobile bottom nav, footer links |
| **SEO** | Meta defaults, analytics IDs, sitemap settings, robots.txt |
| **Social & Contact** | Links, contact info |
| **Performance** | Caching, image quality, ISR settings |

### 9.4 Live Preview

Every site-setup change shows a live preview iframe of the public homepage on the right side of the admin panel. Toggle device width: mobile / tablet / desktop.

### 9.5 Dynamic Theme Injection

```css
:root {
  --color-primary:   {primaryColor};
  --color-secondary: {secondaryColor};
  --color-accent:    {accentColor};
  --bg-dark:         {backgroundDark};
  --bg-light:        {backgroundLight};
  --font-heading:    '{headingFont}', serif;
  --font-body:       '{bodyFont}', sans-serif;
  --font-arabic:     '{arabicFont}', serif;
  --radius:          {radius};
}
```

All Tailwind components reference these CSS variables so the site recolors without redeploy.

### 9.6 Window/Module System Logic

`site_config.modules.{module}.enabled` is read server-side:
- If `false` → section hidden from homepage AND nav link hidden AND public route returns 404
- Each public page also checks its own module toggle before rendering

---

## 10. Custom Font Upload System

### 10.1 Upload Flow

```
Admin uploads:
  - .woff2 (required, modern browsers)
  - .woff  (optional, fallback)
  - .ttf   (optional)
  + name, weight(s), style(s)

→ Server validates mime type + file size (max 2MB per file)
→ Uploaded to Cloudinary as `raw` resource
→ Saved to fonts collection
→ Available in font picker site-wide
```

### 10.2 Font Application

When a font is activated and assigned (heading / body / arabic), the root layout:
```
1. Injects @font-face declarations
2. Updates font-family CSS variables
3. Adds <link rel="preload"> for critical weights
4. Sets font-display: swap
```

### 10.3 Font Manager UI `/app/fonts` (also inside Site Setup → Fonts tab)

- Drag-drop upload area (multiple files)
- List of uploaded fonts with live preview ("Aa Bb Cc 1234 വാർത്തകൾ")
- Activate / Deactivate toggle
- Assign to role: Heading | Body | Arabic-Malayalam
- Delete (with warning if currently active)

### 10.4 Performance

- Fonts served from Cloudinary CDN
- `font-display: swap` to prevent FOIT (flash of invisible text)
- Subset detection for Malayalam glyphs
- Preload critical fonts via `<link rel="preload">`

---

## 11. Per-Item Custom CSS

### 11.1 Scope

Applies to: **News, Video, Blog**, plus optionally Campaign and Event detail pages.

In the admin editor, a "Custom Styling" accordion contains:
- Code editor with CSS syntax highlighting (CodeMirror)
- Live preview pane
- CSS variables exposed: `--primary`, `--accent`, etc.

### 11.2 Safe Auto-Scoping

User writes plain CSS; system wraps it under a unique scope:

```
User input:
  .highlight { color: red; }

Stored as-is, rendered with prefix injected at runtime:
  [data-article="ARTICLE_ID"] .highlight { color: red; }
```

The detail page wraps content:
```
<article data-article="{ID}">
  {content + injected scoped <style>}
</article>
```

Styles cannot leak outside the article.

### 11.3 Security (CSS Sanitization)

CSS is sanitized to strip:
- `@import` (no external CSS loads)
- `expression()` (legacy IE attack)
- `behavior:` properties
- `javascript:` URLs in `url()`
- `position: fixed` on body-level selectors (prevent UI hijack)

Max CSS size: **50 KB per item**.

### 11.4 Permission Gate

Only users with `{module}.custom-css` permission can save custom CSS. Super Admin grants this individually — not part of default roles.

### 11.5 Reusable CSS Templates

Admin can save CSS as named templates ("Featured Story", "Tribute Article", "Press Release Style") and apply with one click to any item.

---

## 12. Sorting & Filtering System

### 12.1 Universal Sort Keys

Every list page (public + admin) supports:

| Sort Key | Public | Admin |
|---|:---:|:---:|
| Newest first (default) | ✅ | ✅ |
| Oldest first | ✅ | ✅ |
| Title A–Z | ✅ | ✅ |
| Title Z–A | ✅ | ✅ |
| Most viewed | ✅ | ✅ |
| Most downloaded (downloads) | ✅ | ✅ |
| Featured first | ✅ | ✅ |
| Pinned first | – | ✅ |
| Manual sort order | ✅ | ✅ |
| Last updated | – | ✅ |
| Created by | – | ✅ |
| Category | ✅ | ✅ |

### 12.2 Filter Options Per Page

| Page | Filters |
|---|---|
| News | Category, date range, language, author, featured |
| Gallery | Category, album type, date range |
| Video | Category, speaker, duration, date range |
| Blog | Category, author, tag, date range |
| Events | Status (upcoming/ongoing/past), category, date range |
| Campaigns | Active/inactive, category, date range |
| Downloads | Category, file type |

### 12.3 URL-Based State (Shareability)

```
/news?category=sahityotsav-26&sort=newest&page=2
/gallery?category=sensorium&album-type=album
/events?status=upcoming&from=2026-07-01
```

### 12.4 UI Pattern

- **Desktop:** Sidebar filters + top sort dropdown
- **Mobile:** Bottom sheet (slides up) for filters and sort — selected filters appear as chips

---

## 13. SEO Architecture

### 13.1 Per-Item SEO Fields (admin form)

- Meta title (default: item title, overridable)
- Meta description (default: first 160 chars, overridable)
- Meta keywords (tags)
- OG image (default: item image, overridable)
- Canonical URL
- "No index" toggle
- Custom JSON-LD structured data

### 13.2 Automatic SEO Features

| Feature | Implementation |
|---|---|
| Dynamic meta tags | Next.js `generateMetadata()` per page |
| OG image generation | `@vercel/og` builds OG with title + branding if not set |
| Sitemap | Auto-generated `/sitemap.xml` from published items |
| Robots.txt | Configurable, admin override |
| JSON-LD | Auto-inject Article / Event / Organization / Breadcrumb |
| Canonical URLs | Auto-set, override per item |
| hreflang | For Malayalam/English bilingual content |
| Image alt text | Required field on every upload |
| Breadcrumbs | Visible + structured data |
| 404 page | Custom with search + popular content |
| Related content | Auto-suggest by category |
| Lazy-loaded images | `next/image` everywhere |
| Core Web Vitals | LCP < 2.5s, CLS < 0.1, INP < 200ms |

### 13.3 Sitemap Structure

```
/sitemap.xml                  → index
  /sitemap-news.xml           → all news (Google News compatible)
  /sitemap-blogs.xml
  /sitemap-events.xml
  /sitemap-gallery.xml
  /sitemap-videos.xml         → with VideoObject schema
  /sitemap-categories.xml     → all standalone categories
  /sitemap-static.xml         → home, about, etc.
```

### 13.4 Analytics

- Google Analytics 4 (configurable via Site Setup)
- Google Search Console verification
- Facebook Pixel (optional)
- Self-hosted view counter (per-item `viewCount`)

---

## 14. Mobile-First UI Strategy

### 14.1 Layout Principles

- Design for **360px width first**, scale up
- Touch targets minimum 44×44px
- Primary CTAs in bottom 1/3 of screen (thumb zone)
- Sticky bottom navigation on public site (configurable)
- Pull-to-refresh on list pages
- Swipeable image galleries (lightbox)
- Swipeable category tabs
- Bottom sheets (not sidebars) for filters

### 14.2 Mobile-Specific Behaviors

| Component | Mobile Behavior |
|---|---|
| Navbar | Hamburger + bottom nav (4 items + "More") |
| Hero | Full-bleed image, text overlay |
| News cards | Single column, image-on-top |
| Gallery | 2-column masonry, swipeable lightbox |
| Video | Vertical-friendly thumbnails, inline play |
| Events | Date-block prominent, swipe between status tabs |
| Search | Full-screen overlay |
| Filters | Bottom sheet, multi-select with chips |
| Admin sidebar | Drawer (slides from left) |
| Admin tables | Card view (no horizontal scroll) |

### 14.3 Mobile Admin Panel

- Bottom nav with 5 most-used modules
- Cards instead of tables
- Forms full-screen on mobile (not modal)
- Image upload via direct camera capture
- Rich text editor: simplified mobile toolbar

### 14.4 PWA Features

- Manifest with icons & theme color
- Service worker for offline of previously-viewed pages
- Add-to-home-screen prompt
- Web Share API (native share sheet)
- WhatsApp share deep link (`wa.me`)
- Click-to-call on contact numbers
- One-tap maps deep link for addresses

### 14.5 Mobile Performance Targets

| Metric | Target |
|---|---|
| LCP (mobile 3G) | < 2.5s |
| FCP | < 1.5s |
| CLS | < 0.1 |
| Total page weight (initial) | < 500 KB |
| JavaScript bundle (gzip) | < 200 KB |

---

## 15. Public Pages Specification

### 15.1 Home Page `/`

Sections (each individually toggleable + drag-to-reorder via Site Setup → Homepage):

1. **Hero Banner** — full-screen image, organization tagline (Malayalam/English), logo overlay
2. **About Section** — 4–5 pillars (Cultural, Spiritual, Education, Environment, Political) with images
3. **Featured Categories** — standalone category cards (Sahityotsav, Sensorium, etc.) marked `isFeatured`
4. **Active Campaigns** — horizontal carousel of `isActive: true`
5. **Latest News** — 3 most recent cards
6. **Latest Videos** — 3 YouTube thumbnails
7. **Gallery Moments** — masonry grid, 4–8 latest
8. **Latest Blogs** — 3 most recent with author/date
9. **Upcoming Events** — date-badge styled list
10. **Newsletter Subscribe** — optional, toggleable
11. **Footer** — logo, social, quick nav, copyright

Data sources: respective collections (latest N by `publishedAt` or `sortOrder`), + `site_config` for hero/branding.

### 15.2 News `/news` + `/news/[slug]`

**List:**
- Grid sorted by `publishedAt DESC` (default; sortable)
- Filter: category, date range, language, author, featured
- Pagination: configurable (default 12 per page)
- Search: title + content full-text

**Detail:**
- Full-width banner image
- Title, category badge, date, author, read time
- Rich HTML content + per-item custom CSS
- Share buttons (WhatsApp, Twitter, copy link)
- Related news (same category, 3 items)
- Breadcrumb

### 15.3 Gallery `/gallery` + `/gallery/[slug]`

**List:**
- Album cards (cover image + count) and standalone images
- Filter by category, album type
- Lightbox on click

**Detail (album):**
- Responsive masonry grid
- Click any image → swipeable lightbox with captions

### 15.4 Video `/video` + `/video/[slug]`

- Grid of cards with YouTube thumbnails
- Click → in-page modal player (no redirect)
- Filter by category
- Detail page includes description, speakers, transcript

### 15.5 About `/about`

- Static + semi-dynamic content
- Organization history (1973)
- Mission, vision
- Pillars section
- Leadership (President, General Secretary, Finance Secretary)
- Wings/Portfolios showcase (IPB, Risala, Let's Smile, WEFI, Kalalayam)

### 15.6 Blog `/blogs` + `/blogs/[slug]`

- Cards: cover, author, date, excerpt
- Filter/sort by category, author, tag
- Detail: author bio, read time, content, share, related

### 15.7 Campaign `/campaigns` + `/campaigns/[slug]`

- All campaigns sorted by date, active highlighted
- Detail page: banner, content, date range, **linked items panel** (news/videos/gallery/blogs)

### 15.8 Event `/events` + `/events/[slug]`

- Grouped by status: Upcoming | Ongoing | Past (tabs, swipeable on mobile)
- Date-badge styled cards
- Detail: full content, dates, location, registration link, linked items

### 15.9 Download `/downloads`

- Grouped by category (collapsible)
- Icon by file type, name, size, download button
- Direct Cloudinary download URL

### 15.10 Category Standalone `/c/[slug]`

- Banner with category cover image + description
- Tabs: News | Videos | Gallery | Blogs | Events (only tabs with content shown)
- All linked items aggregated in one place

---

## 16. Admin Panel Specification

### 16.1 Login `/app/login`

- Username + password
- Error display on invalid
- Redirect to `/app/dashboard` on success
- No "Forgot Password" (admin manages credentials)

### 16.2 Dashboard `/app/dashboard`

**Summary cards:** Total counts per module
**Recent activity feed:** Last 10 create/update operations across modules (with user attribution)
**Quick links:** Most-used module shortcuts
**Stats charts:** Views over time, top content

### 16.3 Content Module Pages

(News, Gallery, Video, Blog, Campaign, Event, Download — same layout pattern)

```
┌─────────────────────────────────────────────────┐
│  [Module Name]              [+ Add New]         │
├─────────────────────────────────────────────────┤
│  [Search]  [Category ▾]  [Status ▾]  [Sort ▾]   │
├─────────────────────────────────────────────────┤
│  DataTable (mobile: card list):                 │
│  ┌────┬──────────┬──────────┬───────┬────────┐  │
│  │ #  │ Title    │ Category │Status │Actions │  │
│  │    │          │          │ ●Pub  │✏️ 🗑️   │  │
│  └────┴──────────┴──────────┴───────┴────────┘  │
│  Pagination: < 1 2 3 >    [Bulk Actions ▾]      │
└─────────────────────────────────────────────────┘
```

**Add/Edit Form** (full-screen on mobile, drawer on desktop):

| Module | Form Fields |
|---|---|
| News | Title, slug (auto), category, secondary categories, image, language, content (rich), excerpt, author, custom CSS, SEO, visibility |
| Gallery | Title, slug, images array (multi-upload), cover, category, album type, SEO |
| Video | Title, slug, YouTube URL, thumbnail (auto/manual), category, speakers, description, transcript, custom CSS, SEO |
| Blog | Title, slug, cover, author info, content, tags, category, custom CSS, SEO |
| Campaign | Title, slug, banner, content, category, fromDate, toDate, isActive, linked items, SEO |
| Event | Title, slug, image, content, fromDate, toDate, location, venue, category, linked items, SEO |
| Download | Name, file upload, category, requiresAuth, SEO |

### 16.4 Categories `/app/categories`

- Table: name, type, modules, linked count, featured, status
- Form: full schema fields from Section 7.2
- Linked content viewer
- Drag-reorder + tree view

### 16.5 Users `/app/users` (Admin only)

- Table: name, username, role, status, last login
- Add/edit form: name, username, email, password, role assignment, custom permissions
- Activate / deactivate / reset password

### 16.6 Roles `/app/roles` (Super Admin only)

- List of roles with description, user count
- Visual permission grid editor
- Create custom roles

### 16.7 Fonts `/app/fonts`

- Drag-drop upload zone
- List with live preview
- Assign to heading / body / arabic
- Activate / delete

### 16.8 Trash `/app/trash`

- Tabbed view per module
- Soft-deleted items with restore / permanent delete
- Bulk actions
- Auto-purge settings

### 16.9 Path Manage `/app/path-manage`

- Table: label, path, order, location (top/bottom/footer), visible, external
- Drag-reorder
- Add custom nav items

### 16.10 Site Setup `/app/site-setup`

See Section 9.3 for tab structure. Includes live preview iframe.

### 16.11 Analytics `/app/analytics`

- Page views over time
- Top content per module
- Visitor sources
- Download counts
- Per-item view stats

---

## 17. API Routes Design

### 17.1 REST Convention

```
GET    /api/{resource}             List (paginated, filterable)
POST   /api/{resource}             Create
GET    /api/{resource}/[id]        Get one
PUT    /api/{resource}/[id]        Update
DELETE /api/{resource}/[id]        Soft delete
```

### 17.2 Auth Check Pattern

```
1. getServerSession(authOptions)
2. If no session → 401
3. If !user.permissions.includes(required) → 403
4. Proceed with DB operation
5. Log to AuditLog
```

### 17.3 Standard Query Parameters

All list endpoints support:
```
?page=1&limit=12
&sort=publishedAt-desc
&category=sahityotsav-26
&q=search-text
&featured=true
&from=2026-01-01&to=2026-12-31
&includeDeleted=false      (admin + permission only)
```

### 17.4 Endpoint Reference

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | /api/news | Public | List published news |
| POST | /api/news | `news.create` | Create |
| PUT | /api/news/[id] | `news.update` | Update |
| DELETE | /api/news/[id] | `news.delete` | Soft delete |
| GET | /api/gallery | Public | List gallery |
| GET | /api/video | Public | List videos |
| GET | /api/blogs | Public | List blogs |
| GET | /api/campaigns | Public | List campaigns |
| GET | /api/events | Public | List events |
| GET | /api/downloads | Public | List downloads |
| GET | /api/categories | Public | List categories (filter by appliesTo) |
| POST/PUT/DELETE | /api/categories[/id] | `categories.manage` | Manage |
| GET | /api/c/[slug] | Public | Aggregated category page data |
| GET | /api/fonts | Public | List active fonts |
| POST | /api/fonts | `fonts.upload` | Upload font |
| DELETE | /api/fonts/[id] | `fonts.upload` | Remove font |
| GET | /api/trash | `trash.view` | List soft-deleted |
| POST | /api/trash/[module]/[id]/restore | `trash.restore` | Restore |
| DELETE | /api/trash/[module]/[id]/purge | `trash.purge` | Permanent delete |
| GET | /api/users | `users.manage` | List users |
| POST | /api/users | `users.manage` | Create |
| GET | /api/roles | `roles.manage` | List roles |
| POST/PUT/DELETE | /api/roles[/id] | `roles.manage` | Manage roles |
| POST | /api/upload | Auth | Upload image/file to Cloudinary |
| GET | /api/site-config | Public | Get site config |
| PUT | /api/site-config | `site.configure` | Update |
| GET | /api/nav-paths | Public | Get nav items |
| POST/PUT/DELETE | /api/nav-paths[/id] | `paths.manage` | Manage nav |
| GET | /api/analytics/summary | `analytics.view` | Dashboard stats |
| GET | /api/seo/og-image | Public | Dynamic OG image (query params) |
| GET | /sitemap.xml | Public | Generated sitemap |
| GET | /robots.txt | Public | Robots file |

---

## 18. Media & File Management

### 18.1 Upload Flow

```
Admin selects file
  → POST /api/upload (multipart/form-data)
  → Server: multer parses + validates (mime, size)
  → Upload to Cloudinary (images: image/, docs: raw/, fonts: raw/)
  → Return { url, publicId, metadata }
  → Admin form stores URL
```

### 18.2 Cloudinary Folder Structure

```
ssf-poonoor/
├── news/
├── gallery/
├── blogs/
├── campaigns/
├── events/
├── videos/thumbnails/
├── downloads/
├── fonts/
└── site/
    ├── logo/
    ├── favicon/
    └── banner/
```

### 18.3 Image Optimization

- All public images use `next/image` with proper width/height
- Cloudinary transformations: auto quality, WebP format
- Gallery thumbnails: `q_auto,f_webp,w_800`; full size for lightbox
- Responsive image srcsets generated by Next.js

### 18.4 File Downloads

- PDFs stored as Cloudinary `raw` resources
- Download button uses Cloudinary URL with `fl_attachment` transform
- Download count incremented server-side per request

### 18.5 Upload Limits

| Type | Max Size |
|---|---|
| Image | 5 MB |
| PDF/Doc | 10 MB |
| Font file (per weight) | 2 MB |
| Video thumbnail | 2 MB |

---

## 19. UI/UX Design Guidelines

### 19.1 Visual Direction (inspired by ssfkerala.org)

**Default Color System:**
- Background dark: `#141414`
- Background light: `#FFFFFF`
- Primary (configurable): SSF Green `#1a6b47`
- Accent: Gold `#c9a84c` (Islamic aesthetic)
- Text primary: `#1a1a1a`
- Text muted: `#6b7280`

**Typography:**
- Display/Heading: Noto Serif Malayalam (Malayalam) + Inter (English)
- Body: DM Sans / Inter
- Configurable per Site Setup (Google Fonts or custom upload)

**Design Patterns:**
- Dark hero sections with light content cards
- Category badges as colored pills
- Date in Malayalam format option
- Card hover: subtle scale + shadow lift
- Section eyebrows: small uppercase before h2 (e.g., "WHAT'S HAPPENING")
- Alternating section backgrounds

### 19.2 Responsive Breakpoints

```
Mobile:   < 640px   single column, hamburger + bottom nav
Tablet:   640–1024px   2-column grids
Desktop:  > 1024px    3–4 column grids
```

### 19.3 Bilingual/Malayalam Support

- `lang="ml"` attribute on Malayalam text elements
- Noto Sans Malayalam / Noto Serif Malayalam loaded
- Page direction: LTR, content can be Malayalam
- Date formatting toggle (English / Malayalam)

### 19.4 Accessibility (WCAG AA)

- ARIA labels on all interactive elements
- Alt text required on every image upload
- Keyboard-navigable admin forms
- Visible focus rings
- Color contrast checked
- Reduced motion respected

---

## 20. Development Phases & Milestones

### Phase 1 — Foundation + Soft Delete (Week 1–2)
- [ ] Next.js + Tailwind + MongoDB setup
- [ ] Mongoose plugins: softDelete, seo, audit
- [ ] NextAuth.js Credentials + JWT
- [ ] Role + permission system (collection + resolver)
- [ ] Middleware route protection
- [ ] Seed: Super Admin user, default roles, default site config

**Deliverable:** Login works, role-aware admin shell, all models with soft-delete plugin

---

### Phase 2 — Category Backbone (Week 3)
- [ ] Category collection + CRUD API
- [ ] Cross-module category reference embedded in all schemas
- [ ] Category admin UI with linked-items panel
- [ ] Standalone category page `/c/[slug]`
- [ ] Pre-seed default categories

**Deliverable:** Category system fully wired across modules

---

### Phase 3 — Core Content Modules (Week 4–5)
- [ ] News CRUD (API + Admin UI + SEO + custom CSS)
- [ ] Blogs CRUD
- [ ] Videos CRUD
- [ ] Gallery CRUD (album support)
- [ ] Image upload (Cloudinary integration)
- [ ] Rich Text Editor (TipTap)
- [ ] Custom CSS editor (CodeMirror) with sanitizer

**Deliverable:** Admin fully manages content with per-item styling

---

### Phase 4 — Extended Modules + Trash (Week 6)
- [ ] Campaigns CRUD
- [ ] Events CRUD
- [ ] Downloads CRUD (PDF upload)
- [ ] Linked items system (campaign/event ↔ news/video/gallery/blogs)
- [ ] Trash page + restore/purge flows
- [ ] Audit log writes on all mutations

**Deliverable:** Full CMS operational, deleted items recoverable

---

### Phase 5 — Users, Roles, Fonts (Week 7)
- [ ] User Management (Admin only)
- [ ] Role Management (Super Admin only) with visual permission grid
- [ ] Custom font upload + management
- [ ] Font assignment to heading/body/arabic roles
- [ ] Activity audit log viewer

**Deliverable:** Multi-manager team can operate the CMS

---

### Phase 6 — Site Setup + Configurability (Week 8)
- [ ] SiteConfig API + admin UI (all tabs)
- [ ] Dynamic theme via CSS variables
- [ ] Homepage section drag-to-reorder
- [ ] Module-level config UI
- [ ] Path manage CRUD with drag-reorder
- [ ] Live preview iframe

**Deliverable:** Site fully themeable & configurable without code

---

### Phase 7 — Public Pages, Mobile-First (Week 9–10)
- [ ] Home page with configurable sections
- [ ] All public list + detail pages
- [ ] Universal sorting + filtering (URL-based)
- [ ] Bottom sheet filters/sort on mobile
- [ ] Mobile bottom navigation
- [ ] Category standalone pages `/c/[slug]`
- [ ] PWA manifest + service worker
- [ ] Search functionality

**Deliverable:** Complete public portal, mobile-optimized

---

### Phase 8 — SEO + Performance (Week 11)
- [ ] Dynamic meta tags per page
- [ ] Sitemap.xml + robots.txt
- [ ] JSON-LD structured data (Article, Event, Organization, Breadcrumb)
- [ ] Dynamic OG image generation
- [ ] Lighthouse optimization to hit Core Web Vitals
- [ ] hreflang for bilingual content
- [ ] Google Analytics integration

**Deliverable:** Production-grade SEO, all CWV targets hit

---

### Phase 9 — QA + Deployment (Week 12)
- [ ] Mobile QA on real devices (iOS Safari, Android Chrome)
- [ ] Malayalam font rendering QA
- [ ] Accessibility audit (WCAG AA)
- [ ] Load testing
- [ ] Security audit (CSS sanitization, file upload, auth bypass tests)
- [ ] Form validation (zod + react-hook-form)
- [ ] Error boundary + custom 404 page
- [ ] Production deployment + smoke test

**Deliverable:** Live site 🎉

---

## 21. Deployment Strategy

### 21.1 Development
```
Local:
  - next dev → http://localhost:3000
  - MongoDB: local or Atlas free tier
  - Cloudinary: dev environment
```

### 21.2 Production — Recommended: Vercel

- Free tier generous for this scale
- Auto-deploy on git push
- Edge caching for public pages
- Environment variables via dashboard
- ISR (Incremental Static Regeneration) for public pages, revalidate every 60s

### 21.3 Alternative: Hostinger VPS

- More control, custom Node.js server
- PM2 for process management
- Nginx reverse proxy
- Manual SSL via Let's Encrypt
- Suitable for long-term cost control

### 21.4 Environment Variables

```
# .env.local
MONGODB_URI=mongodb+srv://...
NEXTAUTH_SECRET=random-secret-string
NEXTAUTH_URL=https://ssfpoonoor.org
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
GA_TRACKING_ID=G-XXXXXXXXXX
```

### 21.5 Scaling Considerations

- MongoDB Atlas auto-scales storage
- Cloudinary handles CDN for all media
- Vercel CDN handles static assets + page caching
- ISR keeps DB load low
- MongoDB indexes on: slug, categoryId, isPublished, publishedAt, isDeleted

---

## 22. Non-Functional Requirements

| Requirement | Target |
|---|---|
| Page load (public, desktop) | < 2s LCP |
| Page load (mobile 3G) | < 2.5s LCP |
| Admin panel load | < 3s |
| Image upload size limit | 5 MB |
| File upload size limit | 10 MB (PDF/doc) |
| Font upload size limit | 2 MB per weight |
| Concurrent admin users | Up to 20 |
| Concurrent public users | 1000+ (Vercel scales) |
| Mobile support | iOS Safari 14+, Android Chrome 90+ |
| Desktop support | Chrome, Firefox, Safari, Edge (latest 2) |
| Uptime target | 99.5% (Vercel SLA) |
| Session timeout | 24 hours JWT |
| Password hashing | bcrypt, 12 rounds |
| Custom CSS max size | 50 KB per item |
| Database query latency | < 100ms p95 |
| API response time | < 300ms p95 |

---

## 23. Summary Checklist

### Collections (MongoDB): 14
`users` · `roles` · `news` · `gallery` · `videos` · `blogs` · `campaigns` · `events` · `downloads` · `categories` · `fonts` · `site_config` · `nav_paths` · `audit_logs`

### Public Pages: 10
`/` · `/about` · `/news` · `/gallery` · `/video` · `/blogs` · `/campaigns` · `/events` · `/downloads` · `/c/[slug]`

### Admin Pages: 14
`/app/login` · `/app/dashboard` · `/app/news` · `/app/gallery` · `/app/video` · `/app/blogs` · `/app/campaigns` · `/app/events` · `/app/downloads` · `/app/categories` · `/app/users` · `/app/roles` · `/app/fonts` · `/app/trash` · `/app/path-manage` · `/app/site-setup` · `/app/analytics`

### Roles: 7 default + custom
Super Admin · Site Manager · Media Manager · Content Manager · Program Manager · Editor · Viewer

### External Services: 2
MongoDB Atlas (database) · Cloudinary (media CDN)

### Key Capabilities
✅ Multi-role manager system with granular permissions
✅ Categories as cross-module backbone (standalone category pages)
✅ Universal soft delete with restore from trash
✅ Custom font upload + assignment
✅ Per-item custom CSS for news/video/blog
✅ Full configurability of every module + homepage section
✅ Universal sort + filter on every list page
✅ Enterprise SEO (sitemap, JSON-LD, OG images, CWV optimized)
✅ Mobile-first PWA with bottom navigation
✅ Bilingual Malayalam/English support
✅ Audit log of all admin actions
✅ Scheduled publishing + drafts
✅ Live preview in Site Setup

---

*Document Version: 3.0 — Master Plan | Prepared for SSF Poonoor Division Web Platform*
*Combines v1 foundational architecture with v2 advanced features.*
