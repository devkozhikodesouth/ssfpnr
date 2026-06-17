// Single source of truth for the four core content modules. Drives the shared
// ContentForm (field list) and ContentTable (columns), so adding/altering a
// field for a module happens in exactly one place — no per-module duplication.
//
// Field types understood by ContentForm:
//   text · textarea · url · select · slug · image · images · richtext · css
//   category · categories · author · speakers · tags · seo · visibility

const LANGUAGE_OPTIONS = [
  { value: 'ml', label: 'Malayalam' },
  { value: 'en', label: 'English' },
  { value: 'both', label: 'Both' },
]

const ALBUM_TYPE_OPTIONS = [
  { value: 'album', label: 'Album' },
  { value: 'single', label: 'Single' },
]

export const CONTENT_MODULES = {
  news: {
    label: 'News',
    singular: 'News Item',
    apiBase: '/api/news',
    basePath: '/app/news',
    appliesTo: 'news',
    fields: [
      { name: 'title', type: 'text', label: 'Title', required: true },
      { name: 'slug', type: 'slug', label: 'Slug', from: 'title' },
      { name: 'image', type: 'image', label: 'Featured Image', folder: 'news' },
      { name: 'categoryId', type: 'category', label: 'Category', required: true },
      { name: 'secondaryCategories', type: 'categories', label: 'Secondary Categories' },
      { name: 'language', type: 'select', label: 'Language', options: LANGUAGE_OPTIONS, default: 'ml' },
      { name: 'excerpt', type: 'textarea', label: 'Excerpt' },
      { name: 'content', type: 'richtext', label: 'Content' },
      { name: 'author', type: 'author', label: 'Author', subFields: ['name', 'role', 'image'] },
      { name: 'customCss', type: 'css', label: 'Custom CSS' },
      { name: 'seo', type: 'seo' },
      { name: 'visibility', type: 'visibility' },
    ],
  },

  blogs: {
    label: 'Blogs',
    singular: 'Blog Post',
    apiBase: '/api/blogs',
    basePath: '/app/blogs',
    appliesTo: 'blog',
    fields: [
      { name: 'title', type: 'text', label: 'Title', required: true },
      { name: 'slug', type: 'slug', label: 'Slug', from: 'title' },
      { name: 'image', type: 'image', label: 'Cover Image', folder: 'blogs' },
      { name: 'categoryId', type: 'category', label: 'Category', required: true },
      { name: 'secondaryCategories', type: 'categories', label: 'Secondary Categories' },
      { name: 'tags', type: 'tags', label: 'Tags' },
      { name: 'excerpt', type: 'textarea', label: 'Excerpt' },
      { name: 'content', type: 'richtext', label: 'Content' },
      { name: 'author', type: 'author', label: 'Author', subFields: ['name', 'role', 'image', 'bio'] },
      { name: 'customCss', type: 'css', label: 'Custom CSS' },
      { name: 'seo', type: 'seo' },
      { name: 'visibility', type: 'visibility' },
    ],
  },

  video: {
    label: 'Video',
    singular: 'Video',
    apiBase: '/api/video',
    basePath: '/app/video',
    appliesTo: 'video',
    fields: [
      { name: 'title', type: 'text', label: 'Title', required: true },
      { name: 'slug', type: 'slug', label: 'Slug', from: 'title' },
      { name: 'youTubeLink', type: 'url', label: 'YouTube URL', required: true },
      { name: 'thumbnail', type: 'image', label: 'Thumbnail', folder: 'videos/thumbnails' },
      { name: 'categoryId', type: 'category', label: 'Category', required: true },
      { name: 'secondaryCategories', type: 'categories', label: 'Secondary Categories' },
      { name: 'duration', type: 'text', label: 'Duration (e.g. 12:34)' },
      { name: 'description', type: 'textarea', label: 'Description' },
      { name: 'transcript', type: 'textarea', label: 'Transcript' },
      { name: 'speakers', type: 'speakers', label: 'Speakers' },
      { name: 'customCss', type: 'css', label: 'Custom CSS' },
      { name: 'seo', type: 'seo' },
      { name: 'visibility', type: 'visibility' },
    ],
  },

  gallery: {
    label: 'Gallery',
    singular: 'Album',
    apiBase: '/api/gallery',
    basePath: '/app/gallery',
    appliesTo: 'gallery',
    fields: [
      { name: 'title', type: 'text', label: 'Title', required: true },
      { name: 'slug', type: 'slug', label: 'Slug', from: 'title' },
      { name: 'albumType', type: 'select', label: 'Album Type', options: ALBUM_TYPE_OPTIONS, default: 'album' },
      { name: 'coverImage', type: 'image', label: 'Cover Image', folder: 'gallery' },
      { name: 'images', type: 'images', label: 'Images', folder: 'gallery' },
      { name: 'categoryId', type: 'category', label: 'Category', required: true },
      { name: 'secondaryCategories', type: 'categories', label: 'Secondary Categories' },
      { name: 'seo', type: 'seo' },
      { name: 'visibility', type: 'visibility' },
    ],
  },
}

export function getModuleConfig(key) {
  return CONTENT_MODULES[key]
}
