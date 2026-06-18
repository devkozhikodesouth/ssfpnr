import Navbar from '@/components/public/layout/Navbar'
import Footer from '@/components/public/layout/Footer'
import BottomNav from '@/components/public/layout/BottomNav'
import { getSiteConfig, getPrimaryNav, getBottomNav, getNavPaths } from '@/lib/public-content'

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

  return (
    <div className="min-h-screen flex flex-col bg-lightbg">
      <Navbar navItems={navItems} siteName={branding.siteName || 'SSF Poonoor'} />
      <main className="flex-grow pb-16 md:pb-0">{children}</main>
      <Footer
        branding={branding}
        social={config?.social || {}}
        contact={config?.contact || {}}
        footer={config?.footer || {}}
        navItems={footerNav.length ? footerNav : navItems}
      />
      <BottomNav items={bottomNav || []} />
    </div>
  )
}
