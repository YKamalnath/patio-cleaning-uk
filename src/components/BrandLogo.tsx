import { company } from '../data/siteData'
import logoUrl from '../assets/logo.png'

type BrandLogoProps = {
  /** Tailwind sizing classes for the logo image (defaults to a compact 40px) */
  imgClassName?: string
  /** Tailwind classes for the wordmark text */
  textClassName?: string
}

/** Compact logo mark + brand wordmark. */
export function BrandLogo({
  imgClassName = 'h-10 w-10 object-contain',
  textClassName = 'font-display text-lg font-extrabold tracking-tight text-white',
}: BrandLogoProps) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <img src={logoUrl} alt={company.name} className={imgClassName} draggable={false} />
      <span className={textClassName}>{company.name}</span>
    </span>
  )
}
