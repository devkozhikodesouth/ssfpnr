'use client'

import ContentSectionEditor from './ContentSectionEditor'

/**
 * Gallery block editor (Website Builder → Gallery). The gallery strip pulls
 * images from the Gallery module; here we only edit its presentation: heading,
 * description, background color and CTA. Writes the homepage gallery section's
 * Mixed `config`.
 *
 * @param {{ value?: object, onChange: (next:object)=>void }} props
 */
export default function GallerySectionEditor({ value = {}, onChange }) {
  return (
    <ContentSectionEditor
      value={value}
      onChange={onChange}
      title="Gallery Content"
      description="Heading and action for the homepage gallery strip. Images come from the Gallery module."
    />
  )
}
