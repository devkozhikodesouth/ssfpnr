/** @type {import('tailwindcss').Config} */

// Wrap a theme CSS variable so Tailwind opacity modifiers (e.g. bg-primary/10,
// from-darkbg/70) still work even though the variable holds a full hex colour
// (set by the Phase 6 ThemeInjector). Without this, `/<opacity>` on a bare
// `var(--x)` colour produces invalid CSS. color-mix is supported in all current
// target browsers (PLAN §22).
function withAlpha(varName) {
  return ({ opacityValue } = {}) =>
    opacityValue === undefined
      ? `var(${varName})`
      : `color-mix(in srgb, var(${varName}) calc(${opacityValue} * 100%), transparent)`
}

module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: withAlpha('--color-primary'),
        secondary: withAlpha('--color-secondary'),
        accent: withAlpha('--color-accent'),
        // Dark hero/footer + light surfaces follow theme vars so they recolor
        // live with Site Setup (PLAN §9.5). Neutral greys stay on slate/gray.
        darkbg: withAlpha('--bg-dark'),
        lightbg: withAlpha('--bg-light'),
        ink: withAlpha('--text-primary'),
        muted: withAlpha('--text-secondary'),
      },
      fontFamily: {
        // `font-serif` = display/heading, `font-sans` = body — both follow the
        // theme font variables (custom uploads override via FontInjector).
        serif: ['var(--font-heading)', 'Noto Serif Malayalam', 'serif'],
        sans: ['var(--font-body)', 'Inter', 'sans-serif'],
        heading: ['var(--font-heading)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
        arabic: ['var(--font-arabic)', 'serif'],
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
        soft: 'var(--radius)',
      },
    },
  },
  plugins: [],
}
