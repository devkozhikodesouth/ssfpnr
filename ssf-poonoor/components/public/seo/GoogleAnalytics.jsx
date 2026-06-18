import Script from 'next/script'

/**
 * Google Analytics 4 (PLAN §13.4). Conditional — renders nothing unless a
 * measurement id is configured in SiteConfig.seo.googleAnalyticsId, so a fresh
 * install ships no tracking. Uses next/script `afterInteractive` so the tag
 * never blocks first paint / Core Web Vitals.
 *
 * @param {{ gaId?: string }} props
 */
export default function GoogleAnalytics({ gaId }) {
  if (!gaId) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}', { anonymize_ip: true });`}
      </Script>
    </>
  )
}
