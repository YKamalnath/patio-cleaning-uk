import { FaArrowRight, FaLeaf, FaPhoneAlt, FaShieldAlt, FaStar, FaWhatsapp } from 'react-icons/fa'
import { FiChevronDown } from 'react-icons/fi'
import { company } from '../../data/siteData'

const trustItems = [
  { icon: FaShieldAlt, label: 'Fully insured' },
  { icon: FaLeaf, label: 'Eco-safe products' },
]

export function HeroSection() {
  return (
    <section className="relative isolate -mt-[100px] flex min-h-[100svh] items-center overflow-hidden bg-brand-navy">
      {/* Background image */}
      <img
        src="https://images.unsplash.com/photo-1707897283727-31befe824066?auto=format&fit=crop&w=2000&q=80"
        alt="Professional pressure washing a driveway"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      {/* Gradient + texture overlays for depth and legibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-navy via-brand-navy/92 to-brand-navy/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-transparent to-brand-navy/60" />
      <div className="water-streaks pointer-events-none absolute inset-0 opacity-60" />
      <div className="pointer-events-none absolute -left-32 top-24 h-96 w-96 rounded-full bg-brand-primary/30 blur-[130px]" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-96 w-96 rounded-full bg-brand-accent/20 blur-[130px]" />

      {/* Content */}
      <div className="relative mx-auto w-full max-w-7xl px-4 pb-20 pt-28 lg:py-0">
        <div className="max-w-2xl">
          <p className="section-label inline-flex items-center border-l-[3px] border-brand-primary pl-3 animate-fade-up">
            Premium Exterior Cleaning
          </p>
          <h1 className="mt-6 font-display text-[2.75rem] font-black leading-[1.04] tracking-tight text-white animate-fade-up sm:text-6xl lg:text-[4.75rem]">
            Professional <span className="text-gradient-teal">Patio</span> Cleaning Services
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-200 animate-fade-up">
            Bring your patio back to life with expert pressure washing and deep outdoor cleaning. Fast, affordable, and reliable service across Manchester and the wider North West.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4 animate-fade-up">
            <a
              href="#quote"
              className="group inline-flex items-center gap-2 rounded-xl bg-brand-primary px-7 py-4 text-base font-bold text-white shadow-blue-btn transition-all duration-200 hover:bg-brand-primaryLight hover:shadow-[0_8px_25px_rgba(21,101,192,0.5)]"
            >
              Get Free Quote
              <FaArrowRight className="transition-transform duration-200 group-hover:translate-x-1.5" />
            </a>
            <a
              href={company.phoneHref}
              className="inline-flex items-center gap-2 rounded-xl border-2 border-brand-accent px-7 py-4 text-base font-semibold text-white transition-all duration-200 hover:bg-brand-accent/10"
            >
              <FaPhoneAlt className="h-4 w-4" /> Call Now
            </a>
            <a
              href={company.whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-whatsapp/60 px-5 py-3 text-sm font-semibold text-whatsapp transition-colors duration-200 hover:bg-whatsapp/10"
            >
              <FaWhatsapp className="h-4 w-4" /> WhatsApp
            </a>
          </div>

          {/* Trust row */}
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 animate-fade-up">
            <div className="flex items-center gap-2">
              <span className="flex gap-0.5 text-brand-amber">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FaStar key={i} className="h-4 w-4" />
                ))}
              </span>
              <span className="text-sm font-semibold text-white">
                4.9/5 <span className="font-normal text-slate-300">· 2,400+ jobs</span>
              </span>
            </div>
            {trustItems.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-sm font-medium text-slate-200">
                <Icon className="h-4 w-4 text-brand-accent" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Animated scroll indicator */}
      <a
        href="#services"
        aria-label="Scroll to services"
        className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1.5 text-brand-accent transition-opacity hover:opacity-80"
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">Scroll</span>
        <FiChevronDown className="h-6 w-6 animate-bounce" />
      </a>
    </section>
  )
}
