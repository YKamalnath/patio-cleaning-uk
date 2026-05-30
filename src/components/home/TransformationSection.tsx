import { Reveal } from '../Reveal'

const features = ['Eco-safe products', 'Commercial equipment', 'Insured professionals']

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
            We remove deep dirt, moss, algae and black spot staining to deliver a cleaner, safer and more premium-looking outdoor space.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            {features.map((feature) => (
              <span
                key={feature}
                className="rounded-full border border-brand-accent bg-brand-accent/10 px-4 py-2 text-sm font-semibold text-brand-accent"
              >
                {feature}
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="grid grid-cols-2 gap-4">
            <figure className="group relative overflow-hidden rounded-2xl">
              <img
                className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                src="https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&w=900&q=80"
                alt="Patio surface before cleaning"
              />
              <span className="absolute left-3 top-3 rounded-full bg-brand-primary px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                Before
              </span>
              <span className="absolute inset-0 bg-brand-primary/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </figure>
            <figure className="group relative overflow-hidden rounded-2xl">
              <img
                className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                src="https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=900&q=80"
                alt="Patio surface after cleaning"
              />
              <span className="absolute left-3 top-3 rounded-full bg-brand-primary px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                After
              </span>
              <span className="absolute inset-0 bg-brand-primary/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </figure>
            <figure className="group relative col-span-2 overflow-hidden rounded-2xl">
              <img
                className="h-60 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
                alt="Premium finished patio"
              />
              <span className="absolute bottom-3 left-3 rounded-full bg-brand-primary px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                Finished Result
              </span>
            </figure>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
