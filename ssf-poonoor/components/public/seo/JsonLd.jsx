/**
 * Injects JSON-LD structured data into the page (PLAN §13.2). Server component —
 * renders a `<script type="application/ld+json">` tag with the supplied data.
 *
 * Accepts a single JSON-LD object or an array of them; null/empty entries are
 * skipped so callers can pass conditionally-built nodes without guarding.
 *
 * @param {{ data: object | object[] | null }} props
 */
export default function JsonLd({ data }) {
  const nodes = (Array.isArray(data) ? data : [data]).filter(
    (d) => d && typeof d === 'object' && Object.keys(d).length
  )
  if (!nodes.length) return null

  return (
    <>
      {nodes.map((node, i) => (
        <script
          key={i}
          type="application/ld+json"
          // JSON.stringify output is safe; escape `<` to avoid breaking out of the tag.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(node).replace(/</g, '\\u003c') }}
        />
      ))}
    </>
  )
}
