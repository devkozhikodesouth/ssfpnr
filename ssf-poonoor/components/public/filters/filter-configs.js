// Declarative filter + sort definitions per module (PLAN §12.1, §12.2). Pure
// data, imported by ListPageLayout (server) which injects dynamic category
// options before passing to the client filter controls. Keeping these here means
// the filter UI is generic and no per-page filter markup is duplicated.

// Universal public sort keys. Downloads also offers "most-downloaded".
export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'title-asc', label: 'Title A–Z' },
  { value: 'title-desc', label: 'Title Z–A' },
  { value: 'most-viewed', label: 'Most Viewed' },
  { value: 'featured', label: 'Featured First' },
]

export const DOWNLOAD_SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'title-asc', label: 'Name A–Z' },
  { value: 'most-downloaded', label: 'Most Downloaded' },
]

// Field types: 'chips' (single-select pills, incl. category), 'segment'
// (segmented control), 'toggle' (boolean), 'daterange' (from/to date inputs).
// Category options are injected at render time from the DB.
const CATEGORY_FIELD = { key: 'category', type: 'chips', label: 'Category', options: [] }
const DATE_FIELD = { key: 'daterange', type: 'daterange', label: 'Date Range' }

export const FILTER_CONFIGS = {
  news: {
    sort: SORT_OPTIONS,
    fields: [
      CATEGORY_FIELD,
      {
        key: 'language',
        type: 'segment',
        label: 'Language',
        options: [
          { value: 'en', label: 'ENG' },
          { value: 'ml', label: 'MAL' },
          { value: 'both', label: 'BOTH' },
        ],
      },
      { key: 'featured', type: 'toggle', label: 'Featured only' },
      DATE_FIELD,
    ],
  },
  blogs: {
    sort: SORT_OPTIONS,
    fields: [CATEGORY_FIELD, { key: 'featured', type: 'toggle', label: 'Featured only' }, DATE_FIELD],
  },
  gallery: {
    sort: SORT_OPTIONS,
    fields: [
      CATEGORY_FIELD,
      {
        key: 'album-type',
        type: 'segment',
        label: 'Album Type',
        options: [
          { value: 'album', label: 'Albums' },
          { value: 'single', label: 'Single' },
        ],
      },
    ],
  },
  video: {
    sort: SORT_OPTIONS,
    fields: [CATEGORY_FIELD, DATE_FIELD],
  },
  campaigns: {
    sort: SORT_OPTIONS,
    fields: [
      CATEGORY_FIELD,
      {
        key: 'active',
        type: 'segment',
        label: 'Status',
        options: [
          { value: 'true', label: 'Active' },
          { value: 'false', label: 'Past' },
        ],
      },
    ],
  },
  events: {
    sort: SORT_OPTIONS,
    fields: [
      {
        key: 'status',
        type: 'segment',
        label: 'Status',
        options: [
          { value: 'upcoming', label: 'Upcoming' },
          { value: 'ongoing', label: 'Ongoing' },
          { value: 'past', label: 'Past' },
        ],
      },
      CATEGORY_FIELD,
    ],
  },
  downloads: {
    sort: DOWNLOAD_SORT_OPTIONS,
    fields: [CATEGORY_FIELD],
  },
}

/** Human label for a filter value, for chips (resolves category slugs → names). */
export function labelForValue(field, value) {
  if (field.type === 'toggle') return field.label
  const opt = (field.options || []).find((o) => String(o.value) === String(value))
  return opt ? opt.label : value
}
