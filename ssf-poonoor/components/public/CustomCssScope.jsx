import { scopeCss } from '@/lib/scope-css'

/**
 * Wraps detail content in an `<article data-article="ID">` and injects the
 * item's custom CSS scoped to that article (PLAN §11.2), so author-supplied
 * styles can never leak to the rest of the page. The CSS was already sanitized
 * on save (lib/css-sanitizer); here it is only scoped + emitted.
 *
 * Server component — no client JS needed.
 *
 * @param {{ id: string, css?: string, className?: string, children: React.ReactNode }} props
 */
export default function CustomCssScope({ id, css, className, children }) {
  const scopeId = String(id)
  const scoped = css ? scopeCss(css, `[data-article="${scopeId}"]`) : ''

  return (
    <article data-article={scopeId} className={className}>
      {scoped ? <style dangerouslySetInnerHTML={{ __html: scoped }} /> : null}
      {children}
    </article>
  )
}
