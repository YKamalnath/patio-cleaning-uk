import { useEffect, useState } from 'react'
import { ApiError, apiGetPublic } from '../lib/api'
import { PageBanner } from '../components/PageBanner'

type PublicGalleryItem = {
  _id: string
  title: string
  imageUrl: string
  caption?: string
}

// Fallback gallery shown when the CMS/API has no published items or is unavailable,
// so the page is never blank or stuck loading in production.
// TODO: Replace these placeholder images with real before/after job photos via the admin gallery.
const FALLBACK_GALLERY: PublicGalleryItem[] = [
  {
    _id: 'fallback-1',
    title: 'Patio Restoration',
    imageUrl: 'https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&w=1000&q=80',
    caption: 'Moss and algae lifted from a sandstone patio.',
  },
  {
    _id: 'fallback-2',
    title: 'Driveway Clean',
    imageUrl: 'https://images.unsplash.com/photo-1591389703635-e15a07b842d7?auto=format&fit=crop&w=1000&q=80',
    caption: 'Block-paved driveway restored to a like-new finish.',
  },
  {
    _id: 'fallback-3',
    title: 'Pressure Washing',
    imageUrl: 'https://images.unsplash.com/photo-1583845112203-29329902332e?auto=format&fit=crop&w=1000&q=80',
    caption: 'Ground-in dirt blasted from paving slabs.',
  },
  {
    _id: 'fallback-4',
    title: 'Pathway Refresh',
    imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1000&q=80',
    caption: 'Slip-safe garden path cleared of weeds and grime.',
  },
  {
    _id: 'fallback-5',
    title: 'Decking Revival',
    imageUrl: 'https://images.unsplash.com/photo-1591825729269-caeb344f6df2?auto=format&fit=crop&w=1000&q=80',
    caption: 'Timber decking gently cleaned and brightened.',
  },
  {
    _id: 'fallback-6',
    title: 'Patio Slabs',
    imageUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1000&q=80',
    caption: 'A spotless finish across a residential patio.',
  },
  {
    _id: 'fallback-7',
    title: 'Front Path Clean',
    imageUrl: 'https://images.unsplash.com/photo-1576941089067-2de3c901e126?auto=format&fit=crop&w=1000&q=80',
    caption: 'Brighter, safer entrance after a deep clean.',
  },
  {
    _id: 'fallback-8',
    title: 'Garden Paving',
    imageUrl: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1000&q=80',
    caption: 'Outdoor paving transformed in a single visit.',
  },
]

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
        const fetched = res.data.items ?? []
        // Use real published items when available; otherwise show placeholders so the page is never blank.
        if (!cancelled) setItems(fetched.length > 0 ? fetched : FALLBACK_GALLERY)
      } catch (err) {
        // API/CMS unavailable — fall back to placeholder images instead of an endless skeleton.
        if (!cancelled) {
          if (err instanceof ApiError && err.status >= 500) {
            // Unexpected server failure: still keep the page populated for visitors.
            setItems(FALLBACK_GALLERY)
          } else {
            setError(err instanceof ApiError ? err.message : 'Could not load gallery.')
            setItems(FALLBACK_GALLERY)
          }
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
        ) : error && items.length === 0 ? (
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
                    <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-accent">Project</p>
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
