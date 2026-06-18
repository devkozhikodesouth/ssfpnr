// SSF Poonoor brand emblem from the mockups (forest-green hexagon + gold
// crescent). Pure SVG so it works in server and client components and recolors
// via currentColor (gold) + the fixed primary green. Used by Navbar, Footer and
// MobileMenu — single source so the mark is never duplicated.

/**
 * @param {{ className?: string }} props className sizes/colours the svg (the
 *   crescent uses currentColor; set text-accent on the parent for gold).
 */
export default function Logo({ className = 'h-6 w-6 text-accent' }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="3.5" />
      <path
        d="M50 15 L80 35 L80 65 L50 85 L20 65 L20 35 Z"
        stroke="#1a6b47"
        strokeWidth="4.5"
        fill="#1a6b47"
        fillOpacity="0.2"
      />
      <path d="M42 35 A 13 13 0 0 1 58 60 A 13 13 0 1 0 42 35" fill="currentColor" />
    </svg>
  )
}
