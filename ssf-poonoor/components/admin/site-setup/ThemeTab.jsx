'use client'

import { ColorField, NumberField, SelectField, TextField, FieldGroup } from './fields'

const HEADER_STYLES = [
  { value: 'classic', label: 'Classic' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'centered', label: 'Centered' },
]
const FOOTER_STYLES = [
  { value: 'classic', label: 'Classic' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'expanded', label: 'Expanded' },
]
const CARD_STYLES = [
  { value: 'shadow', label: 'Shadow' },
  { value: 'border', label: 'Border' },
  { value: 'flat', label: 'Flat' },
]
const RADIUS = [
  { value: 'sharp', label: 'Sharp (0)' },
  { value: 'soft', label: 'Soft (rounded)' },
  { value: 'pill', label: 'Pill (full)' },
]

/**
 * Theme tab — colors (pickers), layout/card style, border radius, base font
 * size. Edits both the `theme` and `layout` branches of SiteConfig, so it takes
 * both slices and two setters.
 */
export default function ThemeTab({ theme = {}, layout = {}, onChangeTheme, onChangeLayout }) {
  const setTheme = (key, v) => onChangeTheme({ ...theme, [key]: v })
  const setFontSize = (key, v) => onChangeTheme({ ...theme, fontSize: { ...(theme.fontSize || {}), [key]: v } })
  const setLayout = (key, v) => onChangeLayout({ ...layout, [key]: v })

  return (
    <div className="space-y-5">
      <FieldGroup title="Colors" description="Drive the site-wide CSS variables. Changes apply on save.">
        <ColorField label="Primary" value={theme.primaryColor} onChange={(v) => setTheme('primaryColor', v)} />
        <ColorField label="Secondary" value={theme.secondaryColor} onChange={(v) => setTheme('secondaryColor', v)} />
        <ColorField label="Accent" value={theme.accentColor} onChange={(v) => setTheme('accentColor', v)} />
        <ColorField label="Background (dark)" value={theme.backgroundDark} onChange={(v) => setTheme('backgroundDark', v)} />
        <ColorField label="Background (light)" value={theme.backgroundLight} onChange={(v) => setTheme('backgroundLight', v)} />
        <ColorField label="Text primary" value={theme.textPrimary} onChange={(v) => setTheme('textPrimary', v)} />
        <ColorField label="Text secondary" value={theme.textSecondary} onChange={(v) => setTheme('textSecondary', v)} />
      </FieldGroup>

      <FieldGroup title="Layout & shape" cols={2}>
        <SelectField label="Header style" value={layout.headerStyle} onChange={(v) => setLayout('headerStyle', v)} options={HEADER_STYLES} />
        <SelectField label="Footer style" value={layout.footerStyle} onChange={(v) => setLayout('footerStyle', v)} options={FOOTER_STYLES} />
        <SelectField label="Card style" value={layout.cardStyle} onChange={(v) => setLayout('cardStyle', v)} options={CARD_STYLES} />
        <SelectField label="Border radius" value={layout.radius} onChange={(v) => setLayout('radius', v)} options={RADIUS} />
      </FieldGroup>

      <FieldGroup title="Typography scale" cols={2} description="Font families are managed in the Fonts tab.">
        <TextField label="Base font size" value={theme.fontSize?.base} onChange={(v) => setFontSize('base', v)} placeholder="16px" />
        <NumberField label="Type scale ratio" value={theme.fontSize?.scale} onChange={(v) => setFontSize('scale', v)} step={0.05} min={1} max={2} />
      </FieldGroup>
    </div>
  )
}
