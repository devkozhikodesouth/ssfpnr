import Navbar from '@/components/public/layout/Navbar'
import Footer from '@/components/public/layout/Footer'
import BottomNav from '@/components/public/layout/BottomNav'
import PublicChrome from '@/components/public/layout/PublicChrome'
import JsonLd from '@/components/public/seo/JsonLd'
import GoogleAnalytics from '@/components/public/seo/GoogleAnalytics'
import { getSiteConfig, getPrimaryNav, getBottomNav, getNavPaths } from '@/lib/public-content'
import { buildJsonLd } from '@/lib/seo'

export const dynamic = 'force-dynamic'

/**
 * Public route-group shell (PLAN §15). Reads SiteConfig + nav-paths ONCE on the
 * server and feeds Navbar / Footer / BottomNav, so individual pages never re-read
 * config for chrome. Mobile content scrolls under the fixed bottom nav (pb-16);
 * the bottom nav is hidden at md+.
 */
export default async function PublicLayout({ children }) {
  const [config, navItems, bottomNav, footerNav] = await Promise.all([
    getSiteConfig(),
    getPrimaryNav(),
    getBottomNav(),
    getNavPaths('footer'),
  ])

  const branding = config?.branding || {}
  // Site-wide Organization structured data (PLAN §13.2), injected once for the
  // whole public portal rather than per page.
  const organizationLd = buildJsonLd({ type: 'Organization', siteConfig: config })

  return (
    <PublicChrome
      pages={config?.chrome?.pages || []}
      header={
        <Navbar
          navItems={navItems}
          siteName={branding.siteName || 'SSF Poonoor'}
          logo={config?.header?.logoUrl || branding.logoLight || branding.logo}
          header={config?.header || {}}
        />
      }
      footer={
        <Footer
          branding={branding}
          social={config?.social || {}}
          contact={config?.contact || {}}
          footer={config?.footer || {}}
          navItems={footerNav.length ? footerNav : navItems}
        />
      }
      bottomNav={<BottomNav items={bottomNav || []} />}
    >
      <JsonLd data={organizationLd} />
      <GoogleAnalytics gaId={config?.seo?.googleAnalyticsId} />
      {children}
    </PublicChrome>
  )
}
