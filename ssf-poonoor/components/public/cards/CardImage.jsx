import Image from 'next/image'
import Logo from '@/components/public/layout/Logo'

/**
 * Lazy, optimized card/cover image with a branded fallback when no URL is set.
 * Shared by every card so image handling (next/image fill + placeholder) lives
 * in one place. The parent must be `relative` with a fixed height.
 *
 * @param {{ src?: string, alt?: string, className?: string, sizes?: string }} props
 */
export default function CardImage({ src, alt = '', sizes = '(max-width: 768px) 100vw, 33vw' }) {
  if (!src) {
    return (
      <div className="absolute inset-0 bg-darkbg flex items-center justify-center">
        <Logo className="h-10 w-10 text-accent/40" />
      </div>
    )
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      className="object-cover"
    />
  )
}
