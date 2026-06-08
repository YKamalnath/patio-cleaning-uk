import type { IconType } from 'react-icons'
import {
  FaArrowRight,
  FaCheck,
  FaClock,
  FaLeaf,
  FaMapMarkerAlt,
  FaPoundSign,
  FaShieldAlt,
  FaStar,
  FaUsers,
} from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { PageBanner } from '../components/PageBanner'
import { Reveal } from '../components/Reveal'
import { useCountUp } from '../hooks/useCountUp'
import { areasCovered, company } from '../data/siteData'

type Stat = { end: number; decimals?: number; suffix?: string; label: string }

const stats: Stat[] = [
  { end: 10, suffix: '+', label: 'Years of experience' },
  { end: 2400, suffix: '+', label: 'Jobs completed' },
  { end: 4.9, decimals: 1, label: 'Average rating' },
  { end: areasCovered.length, suffix: '+', label: 'Areas covered' },
]

function StatItem({ end, decimals = 0, suffix = '', label }: Stat) {
  const { ref, display } = useCountUp<HTMLParagraphElement>({ end, decimals })
  return (
    <div className="text-center">
      <p ref={ref} className="font-display text-3xl font-extrabold text-white sm:text-4xl">
        {display}
        <span className="text-brand-accent">{suffix}</span>
      </p>
      <p className="mt-1 text-sm text-brand-mutedBlue">{label}</p>
    </div>
  )
}

type Feature = { Icon: IconType; title: string; description: string }

const whyChooseUs: Feature[] = [
  {
    Icon: FaShieldAlt,
    title: 'Fully Insured Team',
    description: 'Every job is covered by comprehensive insurance, so your property is protected from start to finish.',
  },
  {
    Icon: FaUsers,
    title: 'Experienced Professionals',
    description: 'Trained, vetted and uniformed technicians who treat your home with care and respect.',
  },
  {
    Icon: FaLeaf,
    title: 'Eco-Safe Products',
    description: 'We use biodegradable, pet- and plant-friendly treatments that are tough on grime, gentle on nature.',
  },
  {
    Icon: FaClock,
    title: 'Punctual & Reliable',
    description: 'We turn up on time, work efficiently and leave your space spotless — no mess, no fuss.',
  },
  {
    Icon: FaPoundSign,
    title: 'Honest, Fair Pricing',
    description: 'Clear, upfront quotes with no hidden charges and flexible plans to suit every budget.',
  },
  {
    Icon: FaStar,
    title: 'Results You Can See',
    description: 'A 4.9/5 average rating across thousands of jobs — we are proud of the finish we deliver.',
  },
]

const values = [
  'Customer-first communication and punctual service',
  'Professional equipment and detail-oriented workmanship',
  'Honest pricing and clear recommendations',
  'Respect for your property, time and privacy',
  'A satisfaction-guaranteed finish on every visit',
]

export function AboutPage() {
  return (
    <>
      <PageBanner
        title="About Outdoor Cleaning Masters"
        description="A professional local team focused on restoring and protecting outdoor spaces to the highest standards."
      />

      {/* Our Story */}
      <section className="bg-brand-offwhite py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-2">
          <Reveal>
            <p className="section-label !text-brand-primary">Our Story</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-brand-navy sm:text-4xl">
              Built On Hard Work And A Spotless Finish
            </h2>
            <div className="mt-5 space-y-4 text-lg leading-relaxed text-brand-muted">
              <p>
                Outdoor Cleaning Masters began with one pressure washer and a simple mission: to provide premium,
                dependable exterior cleaning that homeowners could actually rely on. What started as a small local
                operation in Manchester has grown into a trusted team serving the wider North West.
              </p>
              <p>
                Today we help homeowners, landlords and businesses bring tired patios, driveways, decking and pathways
                back to life. From stubborn moss and algae to years of ground-in grime, we treat every surface with the
                right technique, professional-grade equipment and a genuine eye for detail.
              </p>
              <p>
                We believe great service is about more than just the result — it is punctuality, clear communication and
                treating your home as if it were our own. That is what keeps our customers coming back and recommending
                us to friends and neighbours.
              </p>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="relative">
              <div className="pointer-events-none absolute -inset-4 rounded-[2rem] bg-brand-accent/10 blur-2xl" />
              <img
                src="https://images.unsplash.com/photo-1707897283727-31befe824066?auto=format&fit=crop&w=1200&q=80"
                alt="Outdoor Cleaning Masters pressure washing a driveway"
                className="relative h-72 w-full rounded-3xl object-cover shadow-premium ring-1 ring-black/5 sm:h-96 lg:h-[460px]"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Stats band */}
      <section className="bg-brand-navy py-14">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-4 md:grid-cols-4">
          {stats.map((stat) => (
            <StatItem key={stat.label} {...stat} />
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <Reveal className="mx-auto mb-14 max-w-2xl text-center">
            <p className="section-label !text-brand-primary">Why Choose Us</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-brand-navy sm:text-4xl">
              The Difference Is In The Detail
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-brand-muted">
              We combine professional equipment with old-fashioned care to deliver a finish you will be proud of.
            </p>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {whyChooseUs.map((item, i) => (
              <Reveal key={item.title} delay={(i % 3) * 90}>
                <article className="group h-full rounded-2xl border border-blue-50 bg-white p-7 shadow-card transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-2 hover:shadow-card-hover">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-primary to-brand-accent text-white shadow-blue-btn transition-transform duration-300 group-hover:scale-110">
                    <item.Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 font-display text-xl font-bold text-brand-navy">{item.title}</h3>
                  <p className="mt-2.5 leading-relaxed text-brand-muted">{item.description}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Values + Areas */}
      <section className="bg-brand-offwhite py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-2">
          <Reveal>
            <article className="h-full rounded-3xl bg-white p-8 shadow-premium">
              <h2 className="font-display text-2xl font-bold text-brand-navy">Our Values</h2>
              <ul className="mt-6 space-y-4">
                {values.map((value) => (
                  <li key={value} className="flex items-start gap-3 text-brand-muted">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-primary text-white">
                      <FaCheck className="h-3 w-3" />
                    </span>
                    <span>{value}</span>
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>

          <Reveal delay={120}>
            <article className="h-full rounded-3xl bg-white p-8 shadow-premium">
              <h2 className="font-display text-2xl font-bold text-brand-navy">Where We Work</h2>
              <p className="mt-4 leading-relaxed text-brand-muted">
                Based in Manchester, we cover the city and the wider North West — including Preston, Blackpool, Bolton and
                beyond.
              </p>
              <div className="mt-6 flex flex-wrap gap-2.5">
                {areasCovered.map((area) => (
                  <span
                    key={area}
                    className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-brand-offwhite px-3.5 py-1.5 text-sm font-medium text-brand-navy"
                  >
                    <FaMapMarkerAlt className="h-3 w-3 text-brand-primary" />
                    {area}
                  </span>
                ))}
              </div>
              <Link
                to="/areas"
                className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-brand-primary transition-all duration-200 hover:gap-3"
              >
                See all areas we cover <FaArrowRight className="h-3.5 w-3.5" />
              </Link>
            </article>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-navy py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-display text-3xl font-extrabold text-white sm:text-4xl">
            Ready To Restore Your Outdoor Space?
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-brand-mutedBlue">
            Get a free, no-obligation quote today and see why homeowners across the North West trust Outdoor Cleaning
            Masters.
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
