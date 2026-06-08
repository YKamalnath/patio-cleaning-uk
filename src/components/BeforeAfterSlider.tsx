import { useCallback, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { FaArrowsAltH } from 'react-icons/fa'

type BeforeAfterSliderProps = {
  /** A clean "after" image. The "before" is rendered from the same image with a grime filter for a perfectly aligned comparison. */
  src: string
  alt?: string
  className?: string
}

export function BeforeAfterSlider({ src, alt = '', className = '' }: BeforeAfterSliderProps) {
  const [pos, setPos] = useState(55)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const draggingRef = useRef(false)

  const setFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const pct = ((clientX - rect.left) / rect.width) * 100
    setPos(Math.max(0, Math.min(100, pct)))
  }, [])

  const onPointerDown = (e: ReactPointerEvent) => {
    draggingRef.current = true
    e.currentTarget.setPointerCapture?.(e.pointerId)
    setFromClientX(e.clientX)
  }
  const onPointerMove = (e: ReactPointerEvent) => {
    if (!draggingRef.current) return
    setFromClientX(e.clientX)
  }
  const stopDragging = () => {
    draggingRef.current = false
  }

  return (
    <div
      ref={containerRef}
      className={`relative touch-none select-none overflow-hidden rounded-3xl ring-1 ring-white/15 ${className}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
      role="slider"
      aria-label="Drag to compare before and after"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pos)}
    >
      {/* After (clean) — base layer */}
      <img src={src} alt={alt} className="block h-full w-full object-cover" draggable={false} />
      <span className="pointer-events-none absolute bottom-4 right-4 rounded-full bg-brand-primary px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-lg">
        After
      </span>

      {/* Before (dirty) — same image, clipped, with grime filter */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <img
          src={src}
          alt=""
          aria-hidden="true"
          className="block h-full w-full object-cover [filter:grayscale(0.55)_brightness(0.6)_sepia(0.45)_hue-rotate(35deg)_contrast(1.08)]"
          draggable={false}
        />
        <div className="pointer-events-none absolute inset-0 bg-[#33381c]/40 mix-blend-multiply" />
        <span className="pointer-events-none absolute bottom-4 left-4 rounded-full bg-brand-navy/85 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-lg">
          Before
        </span>
      </div>

      {/* Divider + handle */}
      <div className="pointer-events-none absolute inset-y-0" style={{ left: `${pos}%` }}>
        <div className="absolute inset-y-0 -ml-px w-0.5 bg-white/90 shadow-[0_0_12px_rgba(0,0,0,0.45)]" />
        <div className="absolute top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-brand-primary shadow-xl ring-2 ring-brand-primary/30">
          <FaArrowsAltH className="h-4 w-4" />
        </div>
      </div>
    </div>
  )
}
