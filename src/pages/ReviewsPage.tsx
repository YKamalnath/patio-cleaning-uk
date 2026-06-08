import { FaArrowRight, FaQuoteLeft, FaStar } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { PageBanner } from '../components/PageBanner'
import { Reveal } from '../components/Reveal'

type Review = { name: string; role: string; stars: number; text: string }

const reviewData: Review[] = [
  {
    name: 'James, Altrincham',
    role: 'Homeowner',
    stars: 5,
    text: 'The patio and pathway came up brilliantly. Booking process was simple and communication was great throughout.',
  },
  {
    name: 'Olivia, Stockport',
    role: 'Homeowner',
    stars: 5,
    text: 'Very professional team and excellent finish. The driveway looks amazing after years of grime built up.',
  },
  {
    name: 'Noah, Salford',
    role: 'Landlord',
    stars: 5,
    text: 'On-time, polite and hard-working. Great value for money and I would definitely recommend them to anyone.',
  },
  {
    name: 'Priya, Didsbury',
    role: 'Homeowner',
    stars: 5,
    text: 'They removed years of moss and black spot from our patio. It honestly looks brand new — thrilled with it.',
  },
  {
    name: 'Tom, Bolton',
    role: 'Property Manager',
    stars: 5,
    text: 'Reliable, tidy and thorough across several of our rental properties. A genuinely dependable team.',
  },
  {
    name: 'Sophie, Sale',
    role: 'Homeowner',
    stars: 5,
    text: 'Quick quote, fair price and a fantastic result on our decking. Friendly and careful from start to finish.',
  },
]

function getInitials(name: string) {
  return name
    .split(',')[0]
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function ReviewsPage() {
  return (
    <>
      <PageBanner
        title="Customer Reviews"
        description="Read what local homeowners say about our patio and pressure washing services."
      />

      <section className="bg-brand-offwhite py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          {/* Rating summary */}
          <Reveal className="mx-auto mb-14 max-w-xl rounded-3xl bg-white p-8 text-center shadow-premium">
            <div className="flex justify-center gap-1 text-brand-amber [filter:drop-shadow(0_0_6px_rgba(245,166,35,0.45))]">
              {Array.from({ length: 5 }).map((_, i) => (
                <FaStar key={i} className="h-6 w-6" />
              ))}
            </div>
            <p className="mt-4 font-display text-4xl font-extrabold text-brand-navy">4.9 / 5</p>
            <p className="mt-1 text-brand-muted">Average rating from 2,400+ completed jobs</p>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reviewData.map((item, i) => (
              <Reveal key={item.name} delay={(i % 3) * 90}>
                <article className="relative h-full rounded-2xl border-l-4 border-brand-primary bg-white p-7 shadow-card transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:shadow-card-hover">
                  <FaQuoteLeft className="h-6 w-6 text-brand-primary/15" aria-hidden="true" />
                  <div className="mt-3 flex gap-1 text-brand-amber">
                    {Array.from({ length: item.stars }).map((_, s) => (
                      <FaStar key={s} className="h-4 w-4" />
                    ))}
                  </div>
                  <p className="mt-4 text-[17px] leading-relaxed text-brand-navy">{item.text}</p>
                  <div className="mt-6 flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-primary text-sm font-bold text-white">
                      {getInitials(item.name)}
                    </span>
                    <div>
                      <p className="font-display text-sm font-bold text-brand-navy">{item.name}</p>
                      <p className="text-sm text-brand-muted">{item.role}</p>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-14 text-center">
            <Link
              to="/book"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-7 py-4 text-base font-bold text-white shadow-blue-btn transition-all duration-200 hover:bg-brand-primaryLight"
            >
              Join Our Happy Customers <FaArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  )
}
