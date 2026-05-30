import { FaArrowRight, FaPhoneAlt, FaWhatsapp } from 'react-icons/fa'
import { FiChevronDown } from 'react-icons/fi'
import { company } from '../../data/siteData'
import { useCountUp } from '../../hooks/useCountUp'

type Stat = {
  prefix?: string
  value: number
  decimals?: number
  suffix?: string
  label: string
}

const stats: Stat[] = [
  { value: 2400, suffix: '+', label: 'Projects Completed' },
  { value: 4.9, decimals: 1, suffix: '/5', label: 'Average Review Score' },
  { prefix: '< ', value: 30, suffix: ' min', label: 'Response Time' },
  { value: 35, suffix: '+', label: 'Areas Covered' },
]

function StatItem({ stat }: { stat: Stat }) {
  const { ref, display } = useCountUp<HTMLParagraphElement>({ end: stat.value, decimals: stat.decimals ?? 0 })
  return (
    <div className="glass-sub rounded-2xl p-4 sm:p-5">
      <p ref={ref} className="font-display text-2xl font-extrabold text-brand-accent sm:text-3xl">
        {stat.prefix}
        {display}
        {stat.suffix}
      </p>
      <p className="mt-1 text-xs font-medium text-brand-mutedBlue sm:text-sm">{stat.label}</p>
    </div>
  )
}

export function HeroSection() {
  return (
    <section className="relative isolate -mt-[100px] flex min-h-[100svh] items-center overflow-hidden bg-brand-gradient">
      {/* Radial highlight + diagonal water streaks + dot-grid + ambient glows */}
      <div className="blue-radial pointer-events-none absolute inset-0" />
      <div className="water-streaks pointer-events-none absolute inset-0" />
      <div className="dot-grid-overlay pointer-events-none absolute inset-0 opacity-50 mask-fade-b" />
      <div className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-brand-accent/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-96 w-96 rounded-full bg-brand-primary/40 blur-[120px]" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center gap-12 px-4 pb-16 pt-28 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:py-0">
        {/* Left — 55% */}
        <div className="w-full lg:w-[55%]">
          <p className="section-label inline-flex items-center border-l-[3px] border-brand-primary pl-3 animate-fade-up">
            Premium Exterior Cleaning
          </p>
          <h1 className="mt-6 font-display text-[2.75rem] font-black leading-[1.05] tracking-tight text-white animate-fade-up sm:text-6xl lg:text-[4.5rem]">
            Professional <span className="text-gradient-teal">Patio</span> Cleaning Services
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-brand-mutedBlue animate-fade-up">
            Bring your patio back to life with expert pressure washing and deep outdoor cleaning. Fast, affordable, and reliable service across South London &amp; Surrey.
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
          </div>

          <a
            href={company.whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-whatsapp/50 px-4 py-2 text-sm font-semibold text-whatsapp transition-colors duration-200 hover:bg-whatsapp/10 animate-fade-up"
          >
            <FaWhatsapp className="h-4 w-4" /> Message us on WhatsApp
          </a>
        </div>

        {/* Right — 40% glass stats card */}
        <div className="w-full max-w-md lg:max-w-none lg:w-[40%]">
          <div className="glass-card rounded-3xl p-6 shadow-blue-glow sm:p-7 animate-fade-up">
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <StatItem key={stat.label} stat={stat} />
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-brand-accent/20 bg-brand-primary/20 px-4 py-3 text-center text-sm font-medium text-white">
              <span className="text-brand-accent">✓</span> Fully Insured{' '}
              <span className="text-brand-accent">✓</span> Commercial-Grade Equipment
            </div>
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
