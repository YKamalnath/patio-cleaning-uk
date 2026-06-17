import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { FiMenu, FiX, FiPhone } from 'react-icons/fi'
import { company, navLinks } from '../data/siteData'
import { AnnouncementBar } from './AnnouncementBar'
import { BrandLogo } from './BrandLogo'

const desktopLinkClass = ({ isActive }: { isActive: boolean }) =>
  `group relative text-sm font-medium transition-colors duration-200 ${
    isActive ? 'text-white' : 'text-white/85 hover:text-brand-accent'
  }`

export function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll while the mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <AnnouncementBar />
      <header
        className={`sticky top-0 z-50 border-b bg-[rgba(13,27,62,0.85)] backdrop-blur-[20px] transition-all duration-300 ${
          scrolled
            ? 'border-white/10 shadow-[0_8px_30px_rgba(13,27,62,0.4)]'
            : 'border-white/5'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex animate-fade-in items-center" aria-label={company.name}>
            <BrandLogo />
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            {navLinks.map((link, i) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={desktopLinkClass}
                style={{ animation: 'fadeIn 0.5s ease-out both', animationDelay: `${i * 40}ms` }}
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    <span
                      className={`pointer-events-none absolute -bottom-1.5 left-0 h-0.5 rounded-full bg-brand-primary transition-all duration-300 ${
                        isActive ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}
            <a
              href={company.phoneHref}
              className="inline-flex items-center gap-2 rounded-full bg-brand-primary px-5 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:scale-105 hover:bg-brand-primaryLight hover:shadow-[0_0_20px_rgba(21,101,192,0.5)]"
            >
              <FiPhone className="h-4 w-4" />
              Call Now
            </a>
          </nav>

          <button
            onClick={() => setOpen((prev) => !prev)}
            className="text-white md:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <FiX size={26} /> : <FiMenu size={26} />}
          </button>
        </div>

        {/* Mobile slide-down drawer */}
        <div
          className={`overflow-hidden border-t border-white/10 bg-brand-navy/95 backdrop-blur-xl transition-[max-height,opacity] duration-300 md:hidden ${
            open ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <nav className="space-y-1 px-4 py-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block rounded-xl px-4 py-3 text-base font-medium transition-colors ${
                    isActive ? 'bg-white/5 text-brand-accent' : 'text-white/85 hover:bg-white/5 hover:text-brand-accent'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <a
              href={company.phoneHref}
              className="mt-2 flex items-center justify-center gap-2 rounded-full bg-brand-primary px-5 py-3 text-base font-bold text-white"
            >
              <FiPhone className="h-4 w-4" />
              {company.phoneDisplay}
            </a>
          </nav>
        </div>
      </header>
    </>
  )
}
