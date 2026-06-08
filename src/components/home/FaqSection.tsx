import { useState } from 'react'
import { FiPlus } from 'react-icons/fi'
import { Reveal } from '../Reveal'

const faqs = [
  {
    q: 'How much does patio or driveway cleaning cost?',
    a: 'Pricing depends on the size and condition of the surface. Our packages start from £79, and we always provide a clear, fixed quote upfront before any work begins — with no hidden charges.',
  },
  {
    q: 'How long does a typical job take?',
    a: 'Most domestic patios and driveways are completed within 2–4 hours. Larger or heavily soiled areas may take longer, and we will let you know the expected timing when we quote.',
  },
  {
    q: 'Do you bring your own water and equipment?',
    a: 'Yes. Our team arrives fully equipped with commercial-grade pressure washing systems and eco-safe cleaning products. We only need access to the area to be cleaned.',
  },
  {
    q: 'Are you fully insured?',
    a: 'Absolutely. We are fully insured professionals, so your property is protected throughout the entire job for complete peace of mind.',
  },
  {
    q: 'Which areas do you cover?',
    a: 'We are based in Manchester and provide premium exterior cleaning across the city and the wider North West, including Preston, Blackpool, Bolton and beyond. Not sure if you are in our area? Just get in touch and we will be happy to confirm.',
  },
  {
    q: 'Do I need to be home during the clean?',
    a: 'Not necessarily. As long as we have access to the area and a water source, you do not need to be present. We will keep you updated and send confirmation once the job is complete.',
  },
]

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-4">
        <Reveal className="mb-12 text-center">
          <p className="section-label !text-brand-primary">FAQ</p>
          <h2 className="mt-3 font-display text-3xl font-extrabold text-brand-navy sm:text-4xl md:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-brand-muted">
            Everything you need to know before booking your clean.
          </p>
        </Reveal>

        <div className="space-y-4">
          {faqs.map((item, i) => {
            const isOpen = open === i
            return (
              <Reveal key={item.q} delay={(i % 3) * 80}>
                <div
                  className={`overflow-hidden rounded-2xl border bg-white transition-all duration-300 ${
                    isOpen ? 'border-brand-primary shadow-card' : 'border-blue-50 shadow-card'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="font-display text-base font-bold text-brand-navy sm:text-lg">{item.q}</span>
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white transition-all duration-300 ${
                        isOpen ? 'rotate-45 bg-brand-primary' : 'bg-brand-navy/80'
                      }`}
                    >
                      <FiPlus className="h-4 w-4" />
                    </span>
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-5 leading-relaxed text-brand-muted">{item.a}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
