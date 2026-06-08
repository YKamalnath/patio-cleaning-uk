import type { IconType } from 'react-icons'
import { FaArrowRight, FaCar, FaLeaf, FaRoad, FaSprayCan, FaThLarge } from 'react-icons/fa'
import { GiWoodBeam, GiWoodenFence } from 'react-icons/gi'
import { services } from '../../data/siteData'
import { Reveal } from '../Reveal'

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

export function ServicesSection() {
  return (
    <section id="services" className="bg-brand-offwhite py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4">
        <Reveal className="mb-14 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="section-label !text-brand-primary">Our Services</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-brand-navy sm:text-4xl md:text-5xl">
              High-Performance Exterior Cleaning
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-brand-muted">
              From patios to driveways, we deliver a flawless finish with professional equipment and meticulous care.
            </p>
          </div>
          <a
            href="#pricing"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-brand-primary px-6 py-3 text-sm font-bold text-white shadow-blue-btn transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-primaryLight"
          >
            See pricing &amp; availability <FaArrowRight className="h-3.5 w-3.5" />
          </a>
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
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-primary transition-all duration-300 group-hover:gap-2.5">
                    Learn more <FaArrowRight className="h-3 w-3" />
                  </span>
                </article>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
