import HeroSection from '@/components/public/home/HeroSection'
import AboutSection from '@/components/public/home/AboutSection'
import FeaturedCategories from '@/components/public/home/FeaturedCategories'
import ModuleSection from '@/components/public/home/ModuleSection'
import Newsletter from '@/components/public/home/Newsletter'
import { getSiteConfig } from '@/lib/public-content'

export const dynamic = 'force-dynamic'

// section.type → renderer. The generic ModuleSection covers all content strips
// (CRITICAL ANTI-DUPLICATION: no hardcoded <NewsSection/><BlogSection/> stack).
const MODULE_TYPES = new Set(['news', 'blogs', 'videos', 'gallery', 'events', 'campaigns'])

/**
 * Home page (PLAN §15.1). Renders homepage sections in the exact order/enabled
 * state configured in SiteConfig.homepage.sections (Site Setup → Homepage),
 * mapping each section.type to a component. Reordering/toggling in admin is
 * reflected here on reload — no code change needed.
 */
export default async function HomePage() {
  const config = await getSiteConfig()
  const branding = config?.branding || {}

  const sections = (config?.homepage?.sections || [])
    .filter((s) => s.enabled !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

  // Alternating light/lightbg bands across the "body" sections (mockup pattern).
  let band = 0

  return (
    <>
      {sections.map((section, i) => {
        const key = `${section.type}-${i}`
        const cfg = section.config || {}

        if (section.type === 'hero') {
          return <HeroSection key={key} branding={branding} config={cfg} />
        }
        if (section.type === 'newsletter') {
          return <Newsletter key={key} config={cfg} />
        }

        const alt = band++ % 2 === 1

        if (section.type === 'about') {
          return <AboutSection key={key} config={cfg} alt={alt} />
        }
        if (section.type === 'featured' || section.type === 'categories') {
          return <FeaturedCategories key={key} config={cfg} alt={alt} />
        }
        if (MODULE_TYPES.has(section.type)) {
          return <ModuleSection key={key} type={section.type} config={cfg} alt={alt} />
        }
        return null
      })}
    </>
  )
}
