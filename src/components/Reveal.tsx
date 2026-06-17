import { useRef, type ElementType, type ReactNode } from 'react'
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from '../lib/gsap'

export type RevealVariant = 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade'

type RevealProps = {
  children: ReactNode
  as?: ElementType
  className?: string
  variant?: RevealVariant
  delay?: number
  stagger?: boolean
  staggerEach?: number
}

const fromVars: Record<RevealVariant, gsap.TweenVars> = {
  up: { autoAlpha: 0, y: 72 },
  down: { autoAlpha: 0, y: -72 },
  left: { autoAlpha: 0, x: -64 },
  right: { autoAlpha: 0, x: 64 },
  scale: { autoAlpha: 0, scale: 0.88, y: 24 },
  fade: { autoAlpha: 0 },
}

const toVars: gsap.TweenVars = { autoAlpha: 1, x: 0, y: 0, scale: 1 }

export function Reveal({
  children,
  as,
  className = '',
  variant = 'up',
  delay = 0,
  stagger = false,
  staggerEach = 0.14,
}: RevealProps) {
  const Tag = (as ?? 'div') as ElementType
  const ref = useRef<HTMLElement | null>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return

      const targets = stagger ? Array.from(el.children) : [el]

      if (prefersReducedMotion()) {
        gsap.set(targets, toVars)
        return
      }

      gsap.set(targets, fromVars[variant])

      const tween = gsap.to(targets, {
        ...toVars,
        duration: 1.1,
        delay: delay / 1000,
        ease: 'power3.out',
        stagger: stagger ? staggerEach : 0,
        paused: true,
      })

      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => tween.play(),
      })
    },
    { scope: ref, dependencies: [variant, delay, stagger, staggerEach] },
  )

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  )
}
