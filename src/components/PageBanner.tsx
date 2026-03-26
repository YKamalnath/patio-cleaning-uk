type PageBannerProps = {
  title: string
  description: string
}

export function PageBanner({ title, description }: PageBannerProps) {
  return (
    <section className="bg-brand-navy py-16">
      <div className="mx-auto max-w-7xl px-4">
        <h1 className="text-3xl font-bold text-white md:text-4xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-slate-200">{description}</p>
      </div>
    </section>
  )
}
