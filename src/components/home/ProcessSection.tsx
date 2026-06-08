import type { IconType } from 'react-icons'
import { FaCalendarCheck, FaClipboardList, FaSprayCan, FaSmile } from 'react-icons/fa'
import { Reveal } from '../Reveal'

type Step = { Icon: IconType; title: string; description: string }

const steps: Step[] = [
  {
    Icon: FaClipboardList,
    title: 'Get Your Free Quote',
    description: 'Send your details or call us. We assess your space and give clear, upfront pricing — no surprises.',
  },
  {
    Icon: FaCalendarCheck,
    title: 'Book Your Slot',
    description: 'Choose an appointment that suits you, often within the same week, with same-day options available.',
  },
  {
    Icon: FaSprayCan,
    title: 'We Deep Clean',
    description: 'Our insured team arrives on time and restores your surfaces with commercial-grade equipment.',
  },
  {
    Icon: FaSmile,
    title: 'Enjoy The Result',
    description: 'Relax and enjoy a spotless, refreshed outdoor space — backed by our satisfaction guarantee.',
  },
]

export function ProcessSection() {
  return (
    <section className="bg-brand-offwhite py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4">
        <Reveal className="mx-auto mb-16 max-w-2xl text-center">
          <p className="section-label !text-brand-primary">How It Works</p>
          <h2 className="mt-3 font-display text-3xl font-extrabold text-brand-navy sm:text-4xl md:text-5xl">
            A Simple, Stress-Free Process
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-brand-muted">
            From first call to flawless finish, we make professional outdoor cleaning effortless.
          </p>
        </Reveal>

        <div className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Connecting line on desktop */}
          <div className="pointer-events-none absolute left-0 right-0 top-[2.75rem] hidden h-px bg-gradient-to-r from-transparent via-brand-primary/30 to-transparent lg:block" />

          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 100}>
              <div className="group relative h-full rounded-2xl border border-blue-50 bg-white p-7 text-center shadow-card transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-2 hover:shadow-card-hover">
                <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-primary to-brand-accent text-white shadow-blue-btn transition-transform duration-300 group-hover:scale-110">
                  <step.Icon className="h-7 w-7" aria-hidden="true" />
                  <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-brand-offwhite bg-brand-navy text-xs font-bold text-white">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-lg font-bold text-brand-navy">{step.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-brand-muted">{step.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
