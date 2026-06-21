// Curated catalog of Google-hosted font families the site can use WITHOUT
// uploading a font file. Picked for the heading / body / display / Malayalam
// roles in Site Setup → Theme. Each entry:
//   name : the CSS font-family + the Google "family" name
//   q    : the css2 query fragment (family + the weights we want loaded)
//   cat  : grouping for the selector ('sans'|'serif'|'display'|'handwriting'|'malayalam')
//   ml   : true if the family covers the Malayalam script
//
// Only families that genuinely exist on Google Fonts are listed, so every option
// actually renders. Additional fonts (incl. more Malayalam faces) can still be
// added through Site Setup → Fonts by uploading the font file.

const GOOGLE_FONTS = [
  // --- Sans-serif -------------------------------------------------------
  { name: 'Inter', q: 'Inter:wght@300;400;500;600;700', cat: 'sans' },
  { name: 'Roboto', q: 'Roboto:wght@300;400;500;700', cat: 'sans' },
  { name: 'Open Sans', q: 'Open+Sans:wght@300;400;600;700', cat: 'sans' },
  { name: 'Lato', q: 'Lato:wght@300;400;700', cat: 'sans' },
  { name: 'Montserrat', q: 'Montserrat:wght@300;400;500;600;700', cat: 'sans' },
  { name: 'Raleway', q: 'Raleway:wght@300;400;500;600;700', cat: 'sans' },
  { name: 'Nunito', q: 'Nunito:wght@300;400;600;700', cat: 'sans' },
  { name: 'Poppins', q: 'Poppins:wght@300;400;500;600;700', cat: 'sans' },
  { name: 'Source Sans 3', q: 'Source+Sans+3:wght@300;400;600;700', cat: 'sans' },
  { name: 'PT Sans', q: 'PT+Sans:wght@400;700', cat: 'sans' },
  { name: 'Ubuntu', q: 'Ubuntu:wght@300;400;500;700', cat: 'sans' },
  { name: 'Work Sans', q: 'Work+Sans:wght@300;400;500;600;700', cat: 'sans' },
  { name: 'Rubik', q: 'Rubik:wght@300;400;500;700', cat: 'sans' },
  { name: 'Mukta', q: 'Mukta:wght@300;400;500;700', cat: 'sans' },
  { name: 'Karla', q: 'Karla:wght@300;400;600;700', cat: 'sans' },
  { name: 'Quicksand', q: 'Quicksand:wght@400;500;600;700', cat: 'sans' },
  { name: 'Josefin Sans', q: 'Josefin+Sans:wght@300;400;600;700', cat: 'sans' },
  { name: 'Fira Sans', q: 'Fira+Sans:wght@300;400;500;700', cat: 'sans' },
  { name: 'Manrope', q: 'Manrope:wght@300;400;500;600;700', cat: 'sans' },
  { name: 'DM Sans', q: 'DM+Sans:wght@400;500;700', cat: 'sans' },
  { name: 'Space Grotesk', q: 'Space+Grotesk:wght@400;500;700', cat: 'sans' },
  { name: 'Archivo', q: 'Archivo:wght@400;500;600;700', cat: 'sans' },
  { name: 'Noto Sans', q: 'Noto+Sans:wght@400;500;700', cat: 'sans' },

  // --- Serif ------------------------------------------------------------
  { name: 'Playfair Display', q: 'Playfair+Display:wght@400;500;600;700', cat: 'serif' },
  { name: 'Merriweather', q: 'Merriweather:wght@300;400;700', cat: 'serif' },
  { name: 'Lora', q: 'Lora:wght@400;500;600;700', cat: 'serif' },
  { name: 'Cormorant Garamond', q: 'Cormorant+Garamond:wght@400;500;600;700', cat: 'serif' },
  { name: 'EB Garamond', q: 'EB+Garamond:wght@400;500;600;700', cat: 'serif' },
  { name: 'Libre Baskerville', q: 'Libre+Baskerville:wght@400;700', cat: 'serif' },
  { name: 'PT Serif', q: 'PT+Serif:wght@400;700', cat: 'serif' },
  { name: 'Noto Serif', q: 'Noto+Serif:wght@400;500;700', cat: 'serif' },
  { name: 'Bitter', q: 'Bitter:wght@400;500;700', cat: 'serif' },
  { name: 'Crimson Text', q: 'Crimson+Text:wght@400;600;700', cat: 'serif' },
  { name: 'Roboto Slab', q: 'Roboto+Slab:wght@300;400;500;700', cat: 'serif' },
  { name: 'DM Serif Display', q: 'DM+Serif+Display', cat: 'serif' },

  // --- Display / decorative --------------------------------------------
  { name: 'Oswald', q: 'Oswald:wght@300;400;500;700', cat: 'display' },
  { name: 'Bebas Neue', q: 'Bebas+Neue', cat: 'display' },
  { name: 'Anton', q: 'Anton', cat: 'display' },
  { name: 'Abril Fatface', q: 'Abril+Fatface', cat: 'display' },
  { name: 'Righteous', q: 'Righteous', cat: 'display' },
  { name: 'Permanent Marker', q: 'Permanent+Marker', cat: 'display' },
  { name: 'Cinzel', q: 'Cinzel:wght@400;500;600;700', cat: 'display' },
  { name: 'Teko', q: 'Teko:wght@400;500;600;700', cat: 'display' },
  { name: 'Comfortaa', q: 'Comfortaa:wght@400;500;700', cat: 'display' },

  // --- Handwriting / script --------------------------------------------
  { name: 'Dancing Script', q: 'Dancing+Script:wght@400;500;600;700', cat: 'handwriting' },
  { name: 'Great Vibes', q: 'Great+Vibes', cat: 'handwriting' },
  { name: 'Pacifico', q: 'Pacifico', cat: 'handwriting' },
  { name: 'Caveat', q: 'Caveat:wght@400;500;600;700', cat: 'handwriting' },
  { name: 'Satisfy', q: 'Satisfy', cat: 'handwriting' },
  { name: 'Sacramento', q: 'Sacramento', cat: 'handwriting' },

  // --- Malayalam --------------------------------------------------------
  { name: 'Noto Sans Malayalam', q: 'Noto+Sans+Malayalam:wght@400;500;700', cat: 'malayalam', ml: true },
  { name: 'Noto Serif Malayalam', q: 'Noto+Serif+Malayalam:wght@400;500;700', cat: 'malayalam', ml: true },
  { name: 'Manjari', q: 'Manjari:wght@400;700', cat: 'malayalam', ml: true },
  { name: 'Gayathri', q: 'Gayathri:wght@400;700', cat: 'malayalam', ml: true },
  { name: 'Baloo Chettan 2', q: 'Baloo+Chettan+2:wght@400;500;600;700', cat: 'malayalam', ml: true },
  { name: 'Anek Malayalam', q: 'Anek+Malayalam:wght@400;500;600;700', cat: 'malayalam', ml: true },
  { name: 'Chilanka', q: 'Chilanka', cat: 'malayalam', ml: true },
]

const BY_NAME = new Map(GOOGLE_FONTS.map((f) => [f.name, f]))

/** Look up a catalog entry by its family name. */
function googleFontByName(name) {
  return name ? BY_NAME.get(name) || null : null
}

/** True if `name` is a known Google catalog family. */
function isGoogleFont(name) {
  return !!googleFontByName(name)
}

/**
 * Build a single css2 stylesheet URL for the given family names (unknown names
 * ignored). Returns '' when none are known so callers can skip the <link>.
 */
function googleFontsHref(names = []) {
  const seen = new Set()
  const families = []
  for (const n of names) {
    const f = googleFontByName(n)
    if (f && !seen.has(f.name)) {
      seen.add(f.name)
      families.push(f.q)
    }
  }
  if (!families.length) return ''
  return `https://fonts.googleapis.com/css2?${families.map((q) => `family=${q}`).join('&')}&display=swap`
}

const CATEGORY_LABELS = {
  sans: 'Sans-serif',
  serif: 'Serif',
  display: 'Display',
  handwriting: 'Handwriting',
  malayalam: 'Malayalam',
}

module.exports = {
  GOOGLE_FONTS,
  googleFontByName,
  isGoogleFont,
  googleFontsHref,
  CATEGORY_LABELS,
}
