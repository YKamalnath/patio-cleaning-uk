import { useRef } from 'react'
import type { IconType } from 'react-icons'
import { FaCalendarCheck, FaClipboardList, FaSprayCan, FaSmile } from 'react-icons/fa'
import { Reveal } from '../Reveal'
import { gsap, useGSAP, prefersReducedMotion } from '../../lib/gsap'

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
  const grid = useRef<HTMLDivElement | null>(null)

  useGSAP(
    () => {
      const gridEl = grid.current
      if (!gridEl) return

      const line = gridEl.querySelector('[data-process-line]')
      const stepEls = gsap.utils.toArray<HTMLElement>('[data-process-step]', gridEl)

      if (prefersReducedMotion()) {
        if (line) gsap.set(line, { scaleX: 1 })
        gsap.set(stepEls, { autoAlpha: 1, y: 0, scale: 1 })
        return
      }

      if (line) gsap.set(line, { scaleX: 0, transformOrigin: 'left center' })
      gsap.set(stepEls, { autoAlpha: 0, y: 64, scale: 0.9 })

      if (line) {
        gsap.to(line, {
          scaleX: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: gridEl,
            start: 'top 75%',
            end: 'bottom 60%',
            scrub: 0.8,
          },
        })
      }

      const tween = gsap.to(stepEls, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.9,
        stagger: 0.15,
        ease: 'power3.out',
        paused: true,
      })

      gsap.timeline({
        scrollTrigger: {
          trigger: gridEl,
          start: 'top 80%',
          once: true,
          onEnter: () => tween.play(),
        },
      })
    },
    { scope: grid },
  )

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

        <div ref={grid} className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div
            data-process-line
            className="pointer-events-none absolute left-0 right-0 top-[2.75rem] hidden h-px bg-gradient-to-r from-brand-primary/10 via-brand-primary/40 to-brand-primary/10 lg:block"
          />

          {steps.map((step, i) => (
            <div key={step.title} data-process-step>
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
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
