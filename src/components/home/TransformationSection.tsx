import { FaCheck } from 'react-icons/fa'
import { Reveal } from '../Reveal'
import { BeforeAfterSlider } from '../BeforeAfterSlider'
import { useCountUp } from '../../hooks/useCountUp'

const features = ['Eco-safe products', 'Commercial equipment', 'Insured professionals']

type Stat = { end: number; decimals?: number; suffix?: string; label: string }

const stats: Stat[] = [
  { end: 2400, suffix: '+', label: 'Jobs completed' },
  { end: 4.9, decimals: 1, label: 'Average rating' },
  { end: 100, suffix: '%', label: 'Satisfaction' },
]

function StatItem({ end, decimals = 0, suffix = '', label }: Stat) {
  const { ref, display } = useCountUp<HTMLParagraphElement>({ end, decimals })
  return (
    <div>
      <p ref={ref} className="font-display text-3xl font-extrabold text-white sm:text-4xl">
        {display}
        <span className="text-brand-accent">{suffix}</span>
      </p>
      <p className="mt-1 text-sm text-brand-mutedBlue">{label}</p>
    </div>
  )
}

export function TransformationSection() {
  return (
    <section
      className="relative -my-px bg-brand-navy py-28 md:py-36"
      style={{ clipPath: 'polygon(0 3vw, 100% 0, 100% calc(100% - 3vw), 0 100%)' }}
    >
      <div className="dot-grid-overlay pointer-events-none absolute inset-0 opacity-30" />
      <div className="pointer-events-none absolute right-0 top-1/3 h-80 w-80 rounded-full bg-brand-accent/15 blur-[120px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-2">
        <Reveal>
          <p className="section-label">Transformation</p>
          <h2 className="mt-3 font-display text-3xl font-extrabold text-white sm:text-4xl md:text-5xl">
            See The Difference In One Visit
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-brand-mutedBlue">
            We remove deep dirt, moss, algae and black spot staining to deliver a cleaner, safer and more premium-looking outdoor space. Drag the slider to see the result.
          </p>

          <ul className="mt-7 space-y-3">
            {features.map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-white">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-primary text-white">
                  <FaCheck className="h-3 w-3" />
                </span>
                <span className="font-medium">{feature}</span>
              </li>
            ))}
          </ul>

          <div className="mt-9 grid max-w-md grid-cols-3 gap-6 border-t border-white/10 pt-8">
            {stats.map((stat) => (
              <StatItem key={stat.label} {...stat} />
            ))}
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="relative">
            <div className="pointer-events-none absolute -inset-4 rounded-[2rem] bg-brand-accent/10 blur-2xl" />
            <BeforeAfterSlider
              src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=80"
              alt="Patio surface restored by pressure washing"
              className="relative h-72 shadow-blue-glow sm:h-96 lg:h-[460px]"
            />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
