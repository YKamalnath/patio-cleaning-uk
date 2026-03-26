import { Link } from 'react-router-dom'
import { FiFacebook, FiInstagram, FiMail } from 'react-icons/fi'
import { company, navLinks } from '../data/siteData'

export function Footer() {
  return (
    <footer className="mt-16 bg-brand-navy text-slate-200">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-3">
        <div>
          <h3 className="text-lg font-semibold text-white">{company.name}</h3>
          <p className="mt-3 text-sm leading-6">Premium patio and outdoor pressure washing services trusted across South London and Surrey.</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Quick Links</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link to={link.path} className="hover:text-brand-green">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Contact</h3>
          <p className="mt-3 text-sm">{company.phoneDisplay}</p>
          <p className="text-sm">{company.email}</p>
          <p className="text-sm">{company.address}</p>
          <div className="mt-4 flex gap-3">
            <a href="#" aria-label="Facebook" className="rounded-full bg-slate-800 p-2 hover:bg-slate-700">
              <FiFacebook />
            </a>
            <a href="#" aria-label="Instagram" className="rounded-full bg-slate-800 p-2 hover:bg-slate-700">
              <FiInstagram />
            </a>
            <a href={`mailto:${company.email}`} aria-label="Email" className="rounded-full bg-slate-800 p-2 hover:bg-slate-700">
              <FiMail />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
