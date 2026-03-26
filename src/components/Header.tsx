import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { FiMenu, FiX } from 'react-icons/fi'
import { company, navLinks } from '../data/siteData'

const navClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium transition ${isActive ? 'text-brand-green' : 'text-slate-200 hover:text-white'}`

export function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-brand-navy/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link to="/" className="text-lg font-semibold tracking-wide text-white">
          {company.name}
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <NavLink key={link.path} to={link.path} className={navClass}>
              {link.label}
            </NavLink>
          ))}
          <a href={company.phoneHref} className="rounded-full bg-brand-green px-4 py-2 text-sm font-semibold text-white">
            Call Now
          </a>
        </nav>
        <button onClick={() => setOpen((prev) => !prev)} className="text-white md:hidden" aria-label="Toggle menu">
          {open ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>
      {open && (
        <nav className="space-y-3 border-t border-slate-800 px-4 py-4 md:hidden">
          {navLinks.map((link) => (
            <NavLink key={link.path} to={link.path} className="block text-sm font-medium text-slate-100" onClick={() => setOpen(false)}>
              {link.label}
            </NavLink>
          ))}
          <a href={company.phoneHref} className="inline-block rounded-full bg-brand-green px-4 py-2 text-sm font-semibold text-white">
            {company.phoneDisplay}
          </a>
        </nav>
      )}
    </header>
  )
}
