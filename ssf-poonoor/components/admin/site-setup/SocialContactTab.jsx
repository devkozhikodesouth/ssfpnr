'use client'

import { TextField, TextareaField, FieldGroup } from './fields'

/**
 * Social & Contact tab — social profile links and contact details. Edits the
 * `social` and `contact` branches.
 */
export default function SocialContactTab({ social = {}, contact = {}, onChangeSocial, onChangeContact }) {
  const setSocial = (key, v) => onChangeSocial({ ...social, [key]: v })
  const setContact = (key, v) => onChangeContact({ ...contact, [key]: v })

  return (
    <div className="space-y-5">
      <FieldGroup title="Social links" cols={2}>
        <TextField label="Facebook" value={social.facebook} onChange={(v) => setSocial('facebook', v)} placeholder="https://facebook.com/…" />
        <TextField label="Instagram" value={social.instagram} onChange={(v) => setSocial('instagram', v)} placeholder="https://instagram.com/…" />
        <TextField label="YouTube" value={social.youtube} onChange={(v) => setSocial('youtube', v)} placeholder="https://youtube.com/@…" />
        <TextField label="Twitter / X" value={social.twitter} onChange={(v) => setSocial('twitter', v)} placeholder="https://x.com/…" />
        <TextField label="Telegram" value={social.telegram} onChange={(v) => setSocial('telegram', v)} placeholder="https://t.me/…" />
        <TextField label="WhatsApp" value={social.whatsapp} onChange={(v) => setSocial('whatsapp', v)} placeholder="https://wa.me/…" />
      </FieldGroup>

      <FieldGroup title="Contact" cols={2}>
        <TextField label="Email" type="email" value={contact.email} onChange={(v) => setContact('email', v)} />
        <TextField label="Phone" value={contact.phone} onChange={(v) => setContact('phone', v)} />
        <TextField label="Map link" value={contact.mapLink} onChange={(v) => setContact('mapLink', v)} placeholder="https://maps.google.com/…" />
        <TextareaField label="Address" value={contact.address} onChange={(v) => setContact('address', v)} rows={2} />
      </FieldGroup>
    </div>
  )
}
