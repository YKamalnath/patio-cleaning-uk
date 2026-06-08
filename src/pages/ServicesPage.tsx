import type { IconType } from 'react-icons'
import { FaArrowRight, FaCar, FaCheck, FaLeaf, FaRoad, FaSprayCan, FaThLarge } from 'react-icons/fa'
import { GiWoodBeam, GiWoodenFence } from 'react-icons/gi'
import { Link } from 'react-router-dom'
import { PageBanner } from '../components/PageBanner'
import { Reveal } from '../components/Reveal'
import { services, company } from '../data/siteData'

const serviceMeta: Record<string, { Icon: IconType; description: string }> = {
  'Patio Cleaning': {
    Icon: FaThLarge,
    description: 'Deep surface restoration with safe, controlled pressure for a like-new patio finish.',
  },
  'Driveway Cleaning': {
    Icon: FaCar,
    description: 'Oil stain and organic growth removal that revives kerb appeal in a single visit.',
  },
  'Pressure Washing': {
    Icon: FaSprayCan,
    description: 'Commercial-grade systems that lift ground-in dirt from any hard outdoor surface.',
  },
  'Decking Cleaning': {
    Icon: GiWoodBeam,
    description: 'Gentle yet thorough cleaning that protects timber while removing grime and algae.',
  },
  'Pathway Cleaning': {
    Icon: FaRoad,
    description: 'Slip-safe pathways cleared of moss, weeds and debris for a tidy, premium look.',
  },
  'Fence Cleaning': {
    Icon: GiWoodenFence,
    description: 'Restore fences and boundaries with careful washing that brings back the colour.',
  },
  'Moss and Algae Removal': {
    Icon: FaLeaf,
    description: 'Eco-safe treatments that eliminate moss, algae and black spot at the root.',
  },
}

const included = [
  'Free, no-obligation assessment & quote',
  'Professional, commercial-grade equipment',
  'Eco-safe, pet- and plant-friendly products',
  'Fully insured, uniformed technicians',
  'Tidy finish with a full site clean-up',
]

export function ServicesPage() {
  return (
    <>
      <PageBanner
        title="Our Cleaning Services"
        description="Tailored exterior cleaning services that improve kerb appeal and property value."
      />

      {/* Services grid */}
      <section className="bg-brand-offwhite py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <Reveal className="mx-auto mb-14 max-w-2xl text-center">
            <p className="section-label !text-brand-primary">What We Do</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-brand-navy sm:text-4xl">
              High-Performance Exterior Cleaning
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-brand-muted">
              From patios to driveways, we deliver a flawless finish with professional equipment and meticulous care.
            </p>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((title, i) => {
              const meta = serviceMeta[title]
              const Icon = meta?.Icon
              return (
                <Reveal key={title} delay={(i % 3) * 90}>
                  <article className="group relative h-full overflow-hidden rounded-2xl border border-blue-50 bg-white p-7 shadow-card transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-2 hover:shadow-card-hover">
                    <span className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-brand-primary to-brand-accent transition-transform duration-300 group-hover:scale-x-100" />
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-primary to-brand-accent text-white shadow-blue-btn transition-transform duration-300 group-hover:scale-110">
                      {Icon ? <Icon className="h-6 w-6" aria-hidden="true" /> : null}
                    </div>
                    <h3 className="mt-5 font-display text-xl font-bold text-brand-navy">{title}</h3>
                    <p className="mt-2.5 leading-relaxed text-brand-muted">{meta?.description}</p>
                    <Link
                      to="/book"
                      className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-primary transition-all duration-300 group-hover:gap-2.5"
                    >
                      Get a quote <FaArrowRight className="h-3 w-3" />
                    </Link>
                  </article>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-2">
          <Reveal>
            <div className="relative">
              <div className="pointer-events-none absolute -inset-4 rounded-[2rem] bg-brand-accent/10 blur-2xl" />
              <img
                src="https://images.unsplash.com/photo-1718152521364-b9655b8a7926?auto=format&fit=crop&w=1200&q=80"
                alt="Deep cleaning paving with a pressure washer"
                className="relative h-72 w-full rounded-3xl object-cover shadow-premium ring-1 ring-black/5 sm:h-96 lg:h-[440px]"
              />
            </div>
          </Reveal>

          <Reveal delay={120}>
            <p className="section-label !text-brand-primary">Every Job Includes</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-brand-navy sm:text-4xl">
              A Complete, Professional Service
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-brand-muted">
              Whatever surface we are cleaning, you get the same meticulous standard from start to finish.
            </p>
            <ul className="mt-7 space-y-4">
              {included.map((item) => (
                <li key={item} className="flex items-start gap-3 text-brand-navy">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-primary text-white">
                    <FaCheck className="h-3 w-3" />
                  </span>
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-navy py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-display text-3xl font-extrabold text-white sm:text-4xl">
            Not Sure Which Service You Need?
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-brand-mutedBlue">
            Tell us about your space and we will recommend the right treatment with a clear, free quote.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/book"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-7 py-4 text-base font-bold text-white shadow-blue-btn transition-all duration-200 hover:bg-brand-primaryLight"
            >
              Get Your Free Quote <FaArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={company.phoneHref}
              className="inline-flex items-center gap-2 rounded-xl border-2 border-brand-accent px-7 py-4 text-base font-semibold text-white transition-all duration-200 hover:bg-brand-accent/10"
            >
              Call {company.phoneDisplay}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
