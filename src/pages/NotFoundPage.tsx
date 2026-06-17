import { Link } from 'react-router-dom'
import { FaArrowRight } from 'react-icons/fa'

export function NotFoundPage() {
  return (
    <section className="bg-brand-offwhite py-24 md:py-32">
      <div className="mx-auto max-w-2xl px-4 text-center">
        <p className="font-display text-6xl font-extrabold text-brand-primary sm:text-7xl">404</p>
        <h1 className="mt-4 font-display text-3xl font-extrabold text-brand-navy sm:text-4xl">
          Page Not Found
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-brand-muted">
          Sorry, we couldn&apos;t find that page. It may have been moved or no longer exists.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 rounded-xl bg-brand-primary px-7 py-4 text-base font-bold text-white shadow-blue-btn transition-all duration-200 hover:bg-brand-primaryLight"
          >
            Go Back Home
            <FaArrowRight className="transition-transform duration-200 group-hover:translate-x-1.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
