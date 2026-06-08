import { FaStar } from 'react-icons/fa'
import { Reveal } from '../Reveal'

const testimonials = [
  {
    name: 'Sarah M., Didsbury',
    role: 'Homeowner',
    quote: 'They transformed our patio in one visit. It looks like a brand-new installation.',
  },
  {
    name: 'David R., Sale',
    role: 'Landlord',
    quote: 'Fast response, clear quote, and excellent final result. Great communication throughout.',
  },
  {
    name: 'Anita L., Stockport',
    role: 'Property Manager',
    quote: 'Professional, punctual, and spotless cleanup after the work. Highly recommended team.',
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

export function TestimonialsSection() {
  return (
    <section className="bg-brand-slate py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4">
        <Reveal className="mx-auto mb-14 max-w-2xl text-center">
          <p className="section-label">Testimonials</p>
          <h2 className="mt-3 font-display text-3xl font-extrabold text-brand-navy sm:text-4xl md:text-5xl">
            Trusted By Homeowners Across The UK
          </h2>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((item, i) => (
            <Reveal key={item.name} delay={i * 100}>
              <article className="h-full rounded-2xl border-l-4 border-brand-primary bg-white p-7 shadow-card transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:shadow-card-hover">
                <div className="flex gap-1 text-brand-amber [filter:drop-shadow(0_0_6px_rgba(245,166,35,0.45))]">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <FaStar key={s} className="h-4 w-4" />
                  ))}
                </div>
                <p className="mt-4 text-[17px] italic leading-relaxed text-brand-navy">"{item.quote}"</p>
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
      </div>
    </section>
  )
}
