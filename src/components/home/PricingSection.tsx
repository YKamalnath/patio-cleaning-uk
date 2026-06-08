import { useState } from 'react'
import type { IconType } from 'react-icons'
import { FaArrowRight, FaCheck, FaCrown, FaGem, FaMedal } from 'react-icons/fa'
import { Reveal } from '../Reveal'

type Plan = {
  name: string
  tagline: string
  Icon: IconType
  /** Price per month when billed monthly */
  monthly: number
  /** Price per month when billed annually */
  annual: number
  features: string[]
  popular?: boolean
  headerClass: string
  iconClass: string
}

const plans: Plan[] = [
  {
    name: 'Silver',
    tagline: 'Seasonal upkeep',
    Icon: FaMedal,
    monthly: 99,
    annual: 89,
    headerClass: 'bg-gradient-to-br from-slate-500 to-slate-700',
    iconClass: 'text-slate-200',
    features: [
      '1 professional patio clean per month',
      'Moss, weed & debris treatment',
      'Priority email & WhatsApp support',
    ],
  },
  {
    name: 'Gold',
    tagline: 'Year-round care',
    Icon: FaCrown,
    monthly: 169,
    annual: 149,
    popular: true,
    headerClass: 'bg-gradient-to-br from-amber-400 to-amber-600',
    iconClass: 'text-white',
    features: [
      '2 deep cleans per month',
      'Patio + pathway + driveway',
      'Moss, algae & black spot treatment',
      'Priority booking slots',
      '10% off any additional services',
    ],
  },
  {
    name: 'Platinum',
    tagline: 'Complete protection',
    Icon: FaGem,
    monthly: 279,
    annual: 249,
    headerClass: 'bg-gradient-to-br from-brand-primary to-brand-navy',
    iconClass: 'text-brand-accent',
    features: [
      '4 cleans per month (weekly)',
      'Full property exterior package',
      'Sealant & surface protection',
      'Same-day priority response',
      '20% off any additional services',
      'Dedicated account manager',
    ],
  },
]

export function PricingSection() {
  const [annual, setAnnual] = useState(true)

  return (
    <section id="pricing" className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4">
        <Reveal className="mx-auto mb-10 max-w-2xl text-center">
          <p className="section-label">Membership Plans</p>
          <h2 className="mt-3 font-display text-3xl font-extrabold text-brand-navy sm:text-4xl md:text-5xl">
            Keep It Pristine, Year-Round
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-brand-muted">
            Choose a maintenance plan and never worry about moss, algae or grime again. Cancel anytime.
          </p>
        </Reveal>

        {/* Billing toggle */}
        <Reveal className="mb-14 flex items-center justify-center gap-4">
          <span className={`text-sm font-semibold transition-colors ${!annual ? 'text-brand-navy' : 'text-brand-muted'}`}>
            Monthly
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={annual}
            aria-label="Toggle annual billing"
            onClick={() => setAnnual((v) => !v)}
            className={`relative h-7 w-14 rounded-full transition-colors duration-300 ${annual ? 'bg-brand-primary' : 'bg-slate-300'}`}
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all duration-300 ${
                annual ? 'left-8' : 'left-1'
              }`}
            />
          </button>
          <span className={`text-sm font-semibold transition-colors ${annual ? 'text-brand-navy' : 'text-brand-muted'}`}>
            Annual
          </span>
          <span className="rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-bold text-brand-primary">
            Save up to 15%
          </span>
        </Reveal>

        <div className="grid items-center gap-6 md:grid-cols-3">
          {plans.map((plan, i) => {
            const price = annual ? plan.annual : plan.monthly
            return (
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

                  <div className={`${plan.headerClass} px-7 pb-7 pt-10 text-center`}>
                    <plan.Icon className={`mx-auto h-8 w-8 ${plan.iconClass}`} aria-hidden="true" />
                    <h3 className="mt-3 font-display text-2xl font-bold text-white">{plan.name}</h3>
                    <p className="mt-1 text-sm text-white/80">{plan.tagline}</p>
                    <p className="mt-4 font-display text-white">
                      <span className="text-4xl font-extrabold">£{price}</span>
                      <span className="text-sm font-medium text-white/80">/mo</span>
                    </p>
                    <p className="mt-1 text-xs text-white/70">
                      {annual ? `Billed annually (£${price * 12}/yr)` : 'Billed monthly'}
                    </p>
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
                      className={`group mt-8 flex items-center justify-center gap-2 rounded-lg py-3.5 text-center font-bold transition-all duration-200 ${
                        plan.popular
                          ? 'bg-brand-primary text-white hover:bg-brand-primaryLight hover:shadow-blue-btn'
                          : 'border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white'
                      }`}
                    >
                      Choose {plan.name}
                      <FaArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                    </a>
                  </div>
                </article>
              </Reveal>
            )
          })}
        </div>

        <Reveal className="mt-10 text-center">
          <p className="text-sm text-brand-muted">
            Need a one-off clean instead?{' '}
            <a href="#quote" className="font-semibold text-brand-primary hover:underline">
              Request a free quote
            </a>
            .
          </p>
        </Reveal>
      </div>
    </section>
  )
}
