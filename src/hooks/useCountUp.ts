import { useEffect, useRef, useState } from 'react'

type UseCountUpOptions = {
  /** Final numeric value to count up to */
  end: number
  /** Duration of the animation in ms */
  duration?: number
  /** Number of decimal places to display */
  decimals?: number
}

/**
 * Counts up from 0 to `end` once the returned ref enters the viewport.
 * Returns the live value and a ref to attach to the element to observe.
 */
export function useCountUp<T extends HTMLElement = HTMLElement>({
  end,
  duration = 1600,
  decimals = 0,
}: UseCountUpOptions) {
  const ref = useRef<T | null>(null)
  const [value, setValue] = useState(0)
  const startedRef = useRef(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const run = () => {
      if (startedRef.current) return
      startedRef.current = true

      if (prefersReduced) {
        setValue(end)
        return
      }

      const start = performance.now()
      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1)
        // easeOutExpo for a premium settle
        const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
        setValue(end * eased)
        if (progress < 1) requestAnimationFrame(tick)
        else setValue(end)
      }
      requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            run()
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.4 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [end, duration])

  const display = value.toLocaleString('en-GB', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

  return { ref, value, display }
}
