import { PageBanner } from '../components/PageBanner'

const galleryItems = Array.from({ length: 8 }).map((_, index) => ({
  id: index + 1,
  src: `https://images.unsplash.com/photo-${index % 2 === 0 ? '1505693416388-ac5ce068fe85' : '1558002038-1055907df827'}?auto=format&fit=crop&w=900&q=80`,
}))

export function GalleryPage() {
  return (
    <>
      <PageBanner title="Before & After Gallery" description="Real examples of outdoor cleaning transformations delivered by our team." />
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {galleryItems.map((item) => (
            <img key={item.id} src={item.src} alt={`Patio cleaning work sample ${item.id}`} className="h-52 w-full rounded-3xl object-cover shadow-premium" />
          ))}
        </div>
      </section>
    </>
  )
}
