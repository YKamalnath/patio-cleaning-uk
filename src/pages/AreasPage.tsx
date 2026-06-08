import { FaArrowRight, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { PageBanner } from '../components/PageBanner'
import { Reveal } from '../components/Reveal'
import { areasCovered, company } from '../data/siteData'

export function AreasPage() {
  return (
    <>
      <PageBanner
        title="Areas We Cover"
        description="Reliable service across Manchester and the wider North West."
      />

      <section className="bg-brand-offwhite py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <Reveal className="mx-auto mb-14 max-w-2xl text-center">
            <p className="section-label !text-brand-primary">Local Coverage</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-brand-navy sm:text-4xl">
              Proudly Serving The North West
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-brand-muted">
              Based in Manchester, our local technicians travel across the region — including Preston, Blackpool, Bolton
              and beyond. If your town is not listed, just ask.
            </p>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {areasCovered.map((area, i) => (
              <Reveal key={area} delay={(i % 3) * 80}>
                <article className="group flex h-full items-start gap-4 rounded-2xl border border-blue-50 bg-white p-6 shadow-card transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:shadow-card-hover">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-primary to-brand-accent text-white shadow-blue-btn transition-transform duration-300 group-hover:scale-110">
                    <FaMapMarkerAlt className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-brand-navy">{area}</h3>
                    <p className="mt-1.5 leading-relaxed text-brand-muted">
                      Fast patio, driveway and pathway cleaning appointments available.
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal className="mx-auto mt-14 max-w-3xl rounded-3xl bg-brand-navy p-8 text-center shadow-premium md:p-10">
            <h3 className="font-display text-2xl font-bold text-white">Don&apos;t See Your Area?</h3>
            <p className="mx-auto mt-3 max-w-xl text-brand-mutedBlue">
              We cover a wide radius around Manchester. Give us a call or request a quote and we will confirm
              availability for your postcode.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/book"
                className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-7 py-4 text-base font-bold text-white shadow-blue-btn transition-all duration-200 hover:bg-brand-primaryLight"
              >
                Request a Free Quote <FaArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={company.phoneHref}
                className="inline-flex items-center gap-2 rounded-xl border-2 border-brand-accent px-7 py-4 text-base font-semibold text-white transition-all duration-200 hover:bg-brand-accent/10"
              >
                <FaPhoneAlt className="h-4 w-4" /> {company.phoneDisplay}
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
