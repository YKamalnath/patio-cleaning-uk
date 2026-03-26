import { PageBanner } from '../components/PageBanner'

const reviewData = [
  { name: 'James, Wimbledon', score: '5/5', text: 'The patio and pathway came up brilliantly. Booking process was simple and communication was great.' },
  { name: 'Olivia, Epsom', score: '5/5', text: 'Very professional team and excellent finish. The driveway looks amazing after years of grime.' },
  { name: 'Noah, Purley', score: '5/5', text: 'On-time, polite and hard-working. Great value for money and I would definitely recommend.' },
]

export function ReviewsPage() {
  return (
    <>
      <PageBanner title="Customer Reviews" description="Read what local homeowners say about our patio and pressure washing services." />
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-5 md:grid-cols-3">
          {reviewData.map((item) => (
            <article key={item.name} className="rounded-3xl bg-white p-6 shadow-premium">
              <p className="font-semibold text-brand-green">{item.score}</p>
              <p className="mt-2 text-slate-600">{item.text}</p>
              <p className="mt-4 text-sm font-semibold text-brand-navy">{item.name}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
