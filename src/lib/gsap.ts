import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export const EASE = 'power3.out'

gsap.defaults({ ease: EASE, duration: 0.9 })

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function refreshScroll() {
  requestAnimationFrame(() => ScrollTrigger.refresh())
}

export { gsap, ScrollTrigger, useGSAP }
