import { FaCheck } from 'react-icons/fa'
import { Reveal } from '../Reveal'

type Plan = {
  name: string
  price: string
  features: string[]
  popular?: boolean
}

const pricing: Plan[] = [
  {
    name: 'Essential Clean',
    price: 'From £79',
    features: ['Small patio refresh', 'Weed and debris clear', 'Rinse and tidy finish'],
  },
  {
    name: 'Premium Restore',
    price: 'From £149',
    features: ['Patio + pathway deep clean', 'Moss and algae treatment', 'Seal-ready surface prep'],
    popular: true,
  },
  {
    name: 'Signature Exterior',
    price: 'From £249',
    features: ['Patio + driveway package', 'High-pressure detail wash', 'Priority booking slot'],
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4">
        <Reveal className="mx-auto mb-14 max-w-2xl text-center">
          <p className="section-label">Transparent Pricing</p>
          <h2 className="mt-3 font-display text-3xl font-extrabold text-brand-navy sm:text-4xl md:text-5xl">
            Packages For Every Property Size
          </h2>
        </Reveal>

        <div className="grid items-center gap-6 md:grid-cols-3">
          {pricing.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 100} className={plan.popular ? 'md:-my-2' : ''}>
              <article
                className={`relative flex h-full flex-col overflow-hidden rounded-2xl bg-white transition-all duration-300 ${
                  plan.popular
                    ? 'border-2 border-brand-primary shadow-[0_20px_50px_rgba(21,101,192,0.25)] md:scale-105'
                    : 'border border-blue-50 shadow-card hover:-translate-y-1.5 hover:shadow-card-hover'
                }`}
              >
                {plan.popular && (
                  <span className="absolute left-1/2 top-0 z-10 -translate-x-1/2 rounded-b-lg bg-brand-primary px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white">
                    Most Popular
                  </span>
                )}

                <div className="bg-brand-navy px-7 pb-7 pt-10 text-center">
                  <h3 className="font-display text-xl font-bold text-white">{plan.name}</h3>
                  <p className="mt-3 font-display text-4xl font-extrabold text-brand-accent">{plan.price}</p>
                </div>

                <div className="flex flex-1 flex-col px-7 py-7">
                  <ul className="space-y-3.5">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-brand-muted">
                        <FaCheck className="mt-1 h-3.5 w-3.5 shrink-0 text-brand-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#quote"
                    className="mt-8 block rounded-lg bg-brand-primary py-3.5 text-center font-bold text-white transition-all duration-200 hover:bg-brand-primaryLight hover:shadow-blue-btn"
                  >
                    Select Package
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
