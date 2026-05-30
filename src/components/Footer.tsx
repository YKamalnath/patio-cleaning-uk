import { Link } from 'react-router-dom'
import { FiFacebook, FiInstagram, FiMail } from 'react-icons/fi'
import { FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa'
import { company, navLinks } from '../data/siteData'
import { BrandLogo } from './BrandLogo'

const socialClass =
  'flex h-10 w-10 items-center justify-center rounded-full border border-brand-accent text-brand-accent transition-all duration-200 hover:bg-brand-primary hover:border-brand-primary hover:text-white'

export function Footer() {
  return (
    <footer className="relative bg-brand-navy text-brand-mutedBlue">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-brand-primary to-transparent" />
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 md:grid-cols-3">
        <div>
          <BrandLogo imgClassName="h-12 w-12 object-contain" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-brand-mutedBlue">
            Premium outdoor cleaning services trusted across South London and Surrey.
          </p>
          <div className="mt-6 flex gap-3">
            <a href="#" aria-label="Facebook" className={socialClass}>
              <FiFacebook className="h-4 w-4" />
            </a>
            <a href="#" aria-label="Instagram" className={socialClass}>
              <FiInstagram className="h-4 w-4" />
            </a>
            <a href={`mailto:${company.email}`} aria-label="Email" className={socialClass}>
              <FiMail className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-[0.15em] text-white">Quick Links</h3>
          <ul className="mt-4 grid grid-cols-2 gap-y-2.5 text-sm">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link to={link.path} className="text-brand-mutedBlue transition-colors hover:text-brand-accent">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-[0.15em] text-white">Contact</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-center gap-3">
              <FaPhoneAlt className="h-3.5 w-3.5 shrink-0 text-brand-accent" />
              <a href={company.phoneHref} className="transition-colors hover:text-brand-accent">
                {company.phoneDisplay}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <FiMail className="h-4 w-4 shrink-0 text-brand-accent" />
              <a href={`mailto:${company.email}`} className="transition-colors hover:text-brand-accent">
                {company.email}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <FaMapMarkerAlt className="mt-0.5 h-4 w-4 shrink-0 text-brand-accent" />
              <span className="text-brand-mutedBlue">{company.address}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-4 py-6 text-center text-sm text-brand-muted">
          © {new Date().getFullYear()} {company.name}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
