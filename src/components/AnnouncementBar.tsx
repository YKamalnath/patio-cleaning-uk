import { company } from '../data/siteData'

export function AnnouncementBar() {
  return (
    <div className="relative z-50 bg-brand-navy text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center text-xs font-medium tracking-wide sm:text-sm">
        <span aria-hidden="true" className="text-brand-amber">⚡</span>
        <span>
          Same-Day Response Available —{' '}
          <a href={company.phoneHref} className="font-semibold text-brand-accent hover:underline">
            Call {company.phoneDisplay}
          </a>
        </span>
      </div>
    </div>
  )
}
