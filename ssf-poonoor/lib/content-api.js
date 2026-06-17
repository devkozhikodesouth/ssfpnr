import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { requirePermission, hasPermission } from '@/lib/permissions'
import connectDB from '@/lib/db'
import Category from '@/models/Category'
import { generateUniqueSlug } from '@/lib/slugify'
import sanitizeCss from '@/lib/css-sanitizer'
import { logAction } from '@/lib/audit'

const MAX_CSS_BYTES = 50 * 1024

const SORT_MAP = {
  newest: { publishedAt: -1, createdAt: -1 },
  oldest: { publishedAt: 1, createdAt: 1 },
  'title-asc': { title: 1 },
  'title-desc': { title: -1 },
  'most-viewed': { viewCount: -1 },
  featured: { 'visibility.isFeatured': -1, publishedAt: -1 },
  manual: { 'sort.sortOrder': 1, createdAt: -1 },
  updated: { updatedAt: -1 },
}

function errResponse(err) {
  if (err?.status) {
    return NextResponse.json({ success: false, error: err.message }, { status: err.status })
  }
  if (err?.code === 11000) {
    return NextResponse.json({ success: false, error: 'Duplicate value (slug already exists)' }, { status: 409 })
  }
  return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 })
}

function badRequest(message, status = 400) {
  const err = new Error(message)
  err.status = status
  return err
}

/**
 * Resolve, sanitize and permission-gate a customCss field on the request body.
 * Mutates body.customCss in place. Throws on violation.
 */
function applyCustomCss(body, session, permissionPrefix) {
  if (!('customCss' in body)) return
  const css = body.customCss
  if (!css || css.trim() === '') {
    body.customCss = ''
    return
  }
  if (Buffer.byteLength(css, 'utf8') > MAX_CSS_BYTES) {
    throw badRequest('Custom CSS exceeds the 50 KB limit', 413)
  }
  if (!hasPermission(session, `${permissionPrefix}.custom-css`)) {
    throw badRequest('You do not have permission to set custom CSS', 403)
  }
  const { sanitized, errors } = sanitizeCss(css)
  if (errors.length) {
    throw badRequest(`Custom CSS rejected: ${errors.join('; ')}`)
  }
  body.customCss = sanitized
}

/** Require publish permission if the payload turns publishing on. */
function applyPublishGate(body, session, permissionPrefix) {
  if (body?.visibility?.isPublished) {
    requirePermission(session, `${permissionPrefix}.publish`)
  }
}

/**
 * GET list handler. Public by default (published + non-deleted only).
 * Callers holding `${prefix}.read` may pass status=all|draft and
 * includeDeleted=true for admin views.
 */
export function makeListHandler({ Model, permissionPrefix, searchFields = [] }) {
  return async function GET(request) {
    try {
      await connectDB()
      const sp = new URL(request.url).searchParams

      const page = Math.max(parseInt(sp.get('page') ?? '1', 10) || 1, 1)
      const limit = Math.min(Math.max(parseInt(sp.get('limit') ?? '12', 10) || 12, 1), 100)
      const skip = (page - 1) * limit

      const filter = {}

      const category = sp.get('category')
      if (category) {
        if (/^[0-9a-fA-F]{24}$/.test(category)) {
          filter.categoryId = category
        } else {
          const cat = await Category.findOne({ slug: category }).select('_id').lean()
          filter.categoryId = cat?._id ?? null
        }
      }

      if (sp.get('featured') === 'true') filter['visibility.isFeatured'] = true
      if (sp.get('language')) filter.language = sp.get('language')

      const q = sp.get('q')
      if (q && searchFields.length) {
        filter.$or = searchFields.map((f) => ({ [f]: { $regex: q, $options: 'i' } }))
      }

      const from = sp.get('from')
      const to = sp.get('to')
      if (from || to) {
        filter.publishedAt = {}
        if (from) filter.publishedAt.$gte = new Date(from)
        if (to) filter.publishedAt.$lte = new Date(to)
      }

      const session = await getServerSession(authOptions)
      const canRead = hasPermission(session, `${permissionPrefix}.read`)

      const includeDeleted = sp.get('includeDeleted') === 'true'
      if (includeDeleted) {
        requirePermission(session, `${permissionPrefix}.read`)
        filter.isDeleted = true
      }

      const status = sp.get('status')
      if (!canRead) {
        filter['visibility.isPublished'] = true
      } else if (status === 'published') {
        filter['visibility.isPublished'] = true
      } else if (status === 'draft') {
        filter['visibility.isPublished'] = false
      }

      const sort = SORT_MAP[sp.get('sort')] ?? SORT_MAP.newest

      const [items, total] = await Promise.all([
        Model.find(filter).sort(sort).skip(skip).limit(limit).lean(),
        Model.countDocuments(filter),
      ])

      return NextResponse.json({
        success: true,
        data: items,
        meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
      })
    } catch (err) {
      return errResponse(err)
    }
  }
}

export function makeCreateHandler({ Model, permissionPrefix, hasCustomCss = false }) {
  return async function POST(request) {
    try {
      const session = await getServerSession(authOptions)
      requirePermission(session, `${permissionPrefix}.create`)

      await connectDB()
      const body = await request.json()

      if (hasCustomCss) applyCustomCss(body, session, permissionPrefix)
      else delete body.customCss

      applyPublishGate(body, session, permissionPrefix)

      body.slug = await generateUniqueSlug(Model, body.slug || body.title || body.name)
      body.createdBy = session.user.id
      body.updatedBy = session.user.id
      if (body.visibility?.isPublished) body.publishedAt = new Date()

      const doc = await Model.create(body)
      await logAction(request, { action: 'create', module: permissionPrefix, itemId: doc._id, after: doc })
      return NextResponse.json({ success: true, data: doc }, { status: 201 })
    } catch (err) {
      return errResponse(err)
    }
  }
}

export function makeGetOneHandler({ Model, populate }) {
  return async function GET(_request, { params }) {
    try {
      await connectDB()
      let query = Model.findById(params.id)
      for (const p of populate ?? []) query = query.populate(p)
      const doc = await query.lean()
      if (!doc) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
      return NextResponse.json({ success: true, data: doc })
    } catch (err) {
      return errResponse(err)
    }
  }
}

export function makeUpdateHandler({ Model, permissionPrefix, hasCustomCss = false }) {
  return async function PUT(request, { params }) {
    try {
      const session = await getServerSession(authOptions)
      requirePermission(session, `${permissionPrefix}.update`)

      await connectDB()
      const body = await request.json()

      if (hasCustomCss) applyCustomCss(body, session, permissionPrefix)
      else delete body.customCss

      applyPublishGate(body, session, permissionPrefix)

      // Fetch the live document so plugin pre-save hooks (readTime, version) run.
      const doc = await Model.findById(params.id)
      if (!doc) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })

      const before = doc.toObject()
      const wasPublished = doc.visibility?.isPublished

      // Regenerate slug only when explicitly changed, keeping it unique.
      if (body.slug && body.slug !== doc.slug) {
        body.slug = await generateUniqueSlug(Model, body.slug, params.id)
      } else {
        delete body.slug
      }

      body.updatedBy = session.user.id
      // First publish stamps publishedAt.
      if (body.visibility?.isPublished && !wasPublished) {
        body.publishedAt = new Date()
      }

      doc.set(body)
      await doc.save()

      await logAction(request, { action: 'update', module: permissionPrefix, itemId: doc._id, before, after: doc })
      return NextResponse.json({ success: true, data: doc })
    } catch (err) {
      return errResponse(err)
    }
  }
}

export function makeDeleteHandler({ Model, permissionPrefix }) {
  return async function DELETE(request, { params }) {
    try {
      const session = await getServerSession(authOptions)
      requirePermission(session, `${permissionPrefix}.delete`)

      await connectDB()
      const doc = await Model.findByIdAndUpdate(
        params.id,
        { isDeleted: true, deletedAt: new Date(), deletedBy: session.user.id },
        { new: true }
      )
      if (!doc) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })

      await logAction(request, {
        action: 'delete',
        module: permissionPrefix,
        itemId: doc._id,
        after: { isDeleted: true, deletedAt: doc.deletedAt, deletedBy: doc.deletedBy },
      })
      return NextResponse.json({ success: true, data: { id: params.id } })
    } catch (err) {
      return errResponse(err)
    }
  }
}
