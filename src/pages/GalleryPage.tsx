import { useEffect, useState } from 'react'
import { ApiError, apiGetPublic } from '../lib/api'
import { PageBanner } from '../components/PageBanner'

type PublicGalleryItem = {
  _id: string
  title: string
  imageUrl: string
  caption?: string
}

function mediaSrc(pathOrUrl: string): string {
  if (!pathOrUrl) return ''
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) return pathOrUrl
  const base = import.meta.env.VITE_API_URL ?? ''
  return `${base}${pathOrUrl}`
}

export function GalleryPage() {
  const [items, setItems] = useState<PublicGalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    void (async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await apiGetPublic<{ items: PublicGalleryItem[] }>('/api/public/gallery')
        if (!cancelled) setItems(res.data.items ?? [])
      } catch (err) {
        if (!cancelled) {
          const msg = err instanceof ApiError ? err.message : 'Could not load gallery.'
          setError(msg)
          setItems([])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <>
      <PageBanner title="Before & After Gallery" description="Real examples of outdoor cleaning transformations delivered by our team." />
      <section className="mx-auto max-w-7xl px-4 py-16">
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-busy="true" aria-label="Loading gallery">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-100 shadow-sm"
              >
                <div className="aspect-[4/3] animate-pulse bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200" />
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-center text-sm text-rose-800" role="alert">
            {error}
          </p>
        ) : items.length === 0 ? (
          <div className="mx-auto max-w-md rounded-3xl border border-dashed border-slate-300 bg-white/80 px-8 py-14 text-center shadow-sm">
            <p className="text-sm font-medium text-brand-navy">Gallery coming soon</p>
            <p className="mt-2 text-sm text-slate-600">We are preparing new before-and-after photos from recent jobs.</p>
          </div>
        ) : (
          <>
            <header className="mb-10 max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-green">Portfolio</p>
              <p className="mt-3 text-base leading-relaxed text-slate-600">
                Real outdoor restorations from our team—detail-led cleaning and a finish you can see at a glance.
              </p>
            </header>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((item, index) => (
                <figure
                  key={item._id}
                  className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_12px_40px_rgba(13,27,61,0.08)] ring-1 ring-slate-900/[0.04] transition duration-300 hover:-translate-y-1 hover:shadow-premium"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={mediaSrc(item.imageUrl)}
                      alt={item.caption || item.title}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
                    />
                    <div
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent opacity-95 transition duration-300 group-hover:from-slate-950/95"
                      aria-hidden
                    />
                    <div className="pointer-events-none absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-xs font-bold text-white backdrop-blur-md ring-1 ring-white/25">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                  </div>
                  <figcaption className="absolute inset-x-0 bottom-0 z-10 p-4 sm:p-5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-emerald-300/95">Project</p>
                    <p className="mt-2 text-lg font-semibold leading-snug text-white drop-shadow-sm">{item.title}</p>
                    {item.caption ? (
                      <p className="mt-1.5 text-sm leading-relaxed text-slate-200/95">{item.caption}</p>
                    ) : null}
                  </figcaption>
                </figure>
              ))}
            </div>
          </>
        )}
      </section>
    </>
  )
}
