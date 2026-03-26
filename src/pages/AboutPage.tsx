import { PageBanner } from '../components/PageBanner'

export function AboutPage() {
  return (
    <>
      <PageBanner title="About Elite Patio Care UK" description="A professional local team focused on restoring and protecting outdoor spaces to the highest standards." />
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-8 lg:grid-cols-2">
          <article className="rounded-3xl bg-white p-8 shadow-premium">
            <h2 className="text-2xl font-bold text-brand-navy">Our Story</h2>
            <p className="mt-4 text-slate-600">
              We started with one pressure washer and a mission to provide premium, dependable patio cleaning services across South London. Today, we help homeowners, landlords and businesses keep outdoor surfaces spotless and safe.
            </p>
          </article>
          <article className="rounded-3xl bg-white p-8 shadow-premium">
            <h2 className="text-2xl font-bold text-brand-navy">Our Values</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-600">
              <li>Customer-first communication and punctual service</li>
              <li>Professional equipment and detail-oriented workmanship</li>
              <li>Honest pricing and clear recommendations</li>
            </ul>
          </article>
        </div>
      </section>
    </>
  )
}
