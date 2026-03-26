type SectionHeadingProps = {
  eyebrow?: string
  title: string
  subtitle?: string
}

export function SectionHeading({ eyebrow, title, subtitle }: SectionHeadingProps) {
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center">
      {eyebrow && <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-green">{eyebrow}</p>}
      <h2 className="mt-2 text-3xl font-bold text-brand-navy md:text-4xl">{title}</h2>
      {subtitle && <p className="mt-4 text-base leading-7 text-slate-600">{subtitle}</p>}
    </div>
  )
}
