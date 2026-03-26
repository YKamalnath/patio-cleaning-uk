import { PageBanner } from '../components/PageBanner'
import { services } from '../data/siteData'

export function ServicesPage() {
  return (
    <>
      <PageBanner title="Our Cleaning Services" description="Tailored exterior cleaning services that improve kerb appeal and property value." />
      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-16 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <article key={service} className="rounded-3xl bg-white p-6 shadow-premium">
            <h2 className="text-xl font-semibold text-brand-navy">{service}</h2>
            <p className="mt-3 text-slate-600">Deep cleaning with specialist nozzles and controlled pressure to safely remove stains, grime and growth.</p>
          </article>
        ))}
      </section>
    </>
  )
}
