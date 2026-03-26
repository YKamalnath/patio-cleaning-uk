import { PageBanner } from '../components/PageBanner'
import { areasCovered } from '../data/siteData'

export function AreasPage() {
  return (
    <>
      <PageBanner title="Areas We Cover" description="Reliable service across South London and nearby Surrey areas." />
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {areasCovered.map((area) => (
            <article key={area} className="rounded-3xl bg-white p-6 shadow-premium">
              <h2 className="text-xl font-semibold text-brand-navy">{area}</h2>
              <p className="mt-2 text-slate-600">Local technicians available for fast patio, driveway and pathway cleaning appointments.</p>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
