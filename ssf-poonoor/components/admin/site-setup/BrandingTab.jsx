'use client'

import ImageUploader from '@/components/admin/forms/ImageUploader'
import { TextField, FieldGroup } from './fields'

/**
 * Branding tab — site name, taglines, logos (light/dark), favicon, default OG
 * image. Edits the `branding` branch of SiteConfig.
 */
export default function BrandingTab({ value = {}, onChange }) {
  const set = (key, v) => onChange({ ...value, [key]: v })

  return (
    <div className="space-y-5">
      <FieldGroup title="Identity" description="The site name and taglines used across the portal.">
        <TextField label="Site name" value={value.siteName} onChange={(v) => set('siteName', v)} placeholder="SSF Poonoor" />
        <TextField label="Tagline" value={value.tagline} onChange={(v) => set('tagline', v)} placeholder="Knowledge · Culture · Service" />
      </FieldGroup>

      <FieldGroup title="Logos" cols={2} description="Light logo shows on dark backgrounds; dark logo on light.">
        <ImageUploader label="Logo (primary)" value={value.logo} onChange={(v) => set('logo', v)} folder="site/logo" />
        <ImageUploader label="Favicon" value={value.favicon} onChange={(v) => set('favicon', v)} folder="site/favicon" />
        <ImageUploader label="Logo (light)" value={value.logoLight} onChange={(v) => set('logoLight', v)} folder="site/logo" />
        <ImageUploader label="Logo (dark)" value={value.logoDark} onChange={(v) => set('logoDark', v)} folder="site/logo" />
      </FieldGroup>

      <FieldGroup title="Social sharing" cols={1} description="Default image used when a page has no specific OG image.">
        <ImageUploader label="Default OG image" value={value.ogDefaultImage} onChange={(v) => set('ogDefaultImage', v)} folder="site/banner" />
      </FieldGroup>
    </div>
  )
}
