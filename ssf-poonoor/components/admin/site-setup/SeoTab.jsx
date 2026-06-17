'use client'

import { TextField, TextareaField, ToggleField, FieldGroup } from './fields'

/**
 * SEO tab — meta defaults, analytics IDs, sitemap toggle and custom robots.txt.
 * Edits the `seo` branch. Keywords are edited as a comma-separated string and
 * stored as an array.
 */
export default function SeoTab({ value = {}, onChange }) {
  const set = (key, v) => onChange({ ...value, [key]: v })

  const keywords = Array.isArray(value.defaultKeywords) ? value.defaultKeywords.join(', ') : ''
  const setKeywords = (str) =>
    set(
      'defaultKeywords',
      str
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    )

  return (
    <div className="space-y-5">
      <FieldGroup title="Meta defaults" cols={1}>
        <TextField label="Default title" value={value.defaultTitle} onChange={(v) => set('defaultTitle', v)} placeholder="SSF Poonoor" />
        <TextField label="Title template" value={value.titleTemplate} onChange={(v) => set('titleTemplate', v)} placeholder="%s | SSF Poonoor" />
        <TextareaField label="Default description" value={value.defaultDescription} onChange={(v) => set('defaultDescription', v)} />
        <TextField label="Default keywords (comma-separated)" value={keywords} onChange={setKeywords} placeholder="ssf, poonoor, news" />
      </FieldGroup>

      <FieldGroup title="Analytics & verification" cols={2}>
        <TextField label="Google Analytics ID" value={value.googleAnalyticsId} onChange={(v) => set('googleAnalyticsId', v)} placeholder="G-XXXXXXXXXX" />
        <TextField label="Google Search Console ID" value={value.googleSearchConsoleId} onChange={(v) => set('googleSearchConsoleId', v)} />
        <TextField label="Facebook App ID" value={value.facebookAppId} onChange={(v) => set('facebookAppId', v)} />
        <TextField label="Twitter handle" value={value.twitterHandle} onChange={(v) => set('twitterHandle', v)} placeholder="@ssfpoonoor" />
      </FieldGroup>

      <FieldGroup title="Sitemap & robots" cols={1}>
        <ToggleField label="Generate sitemap.xml" value={value.sitemapEnabled !== false} onChange={(v) => set('sitemapEnabled', v)} />
        <TextareaField label="Custom robots.txt (optional)" value={value.robotsTxtCustom} onChange={(v) => set('robotsTxtCustom', v)} rows={5} />
      </FieldGroup>
    </div>
  )
}
