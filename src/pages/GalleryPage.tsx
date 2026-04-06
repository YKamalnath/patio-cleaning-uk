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
          <p className="text-center text-slate-600">Loading gallery…</p>
        ) : error ? (
          <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-center text-sm text-rose-800" role="alert">
            {error}
          </p>
        ) : items.length === 0 ? (
          <p className="text-center text-slate-600">Gallery photos will appear here soon.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item) => (
              <figure key={item._id} className="overflow-hidden rounded-3xl shadow-premium">
                <img
                  src={mediaSrc(item.imageUrl)}
                  alt={item.caption || item.title}
                  className="h-52 w-full object-cover"
                />
                <figcaption className="border-t border-slate-100 bg-white px-3 py-2 text-xs text-slate-600">
                  {item.title}
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
