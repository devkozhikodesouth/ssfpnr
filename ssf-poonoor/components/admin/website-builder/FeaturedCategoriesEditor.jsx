'use client'

import ContentSectionEditor from './ContentSectionEditor'

/**
 * Website Builder → Featured Categories editor. The "special categories" strip
 * on the homepage (/c/[slug] tiles). Content follows the standard section
 * pattern (eyebrow/title/subtitle/description/background/CTA/typography); which
 * categories appear is controlled by the "Featured" flag on each Category.
 */
export default function FeaturedCategoriesEditor({ value, onChange }) {
  return (
    <ContentSectionEditor
      value={value}
      onChange={onChange}
      title="Featured Categories"
      description="The special-category tiles on the homepage. Mark a category as “Featured” (Categories → edit) to include it here."
    />
  )
}
