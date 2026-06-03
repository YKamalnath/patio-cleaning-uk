import { FaCalendarCheck, FaHeadset, FaLock, FaShieldAlt } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { bookingDepositGbp } from '../../data/bookingData'
import { company } from '../../data/siteData'

type BookingSummaryProps = {
  serviceType: string
  preferredDate: string
  area: string
  timeSlot: string
  guestName: string
}

function formatDate(isoDate: string) {
  if (!isoDate) return '—'
  try {
    return new Date(isoDate + 'T12:00:00').toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return isoDate
  }
}

export function BookingSummary({
  serviceType,
  preferredDate,
  area,
  timeSlot,
  guestName,
}: BookingSummaryProps) {
  const deposit = bookingDepositGbp.toFixed(2)

  return (
    <aside className="lg:sticky lg:top-24">
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-premium">
        <div className="border-b border-slate-100 bg-brand-navy px-6 py-5">
          <h2 className="font-display text-lg font-bold text-white">Booking summary</h2>
          <p className="mt-1 text-sm text-brand-mutedBlue">Live quote updates as you complete each step</p>
        </div>

        <div className="space-y-4 px-6 py-5">
          <div className="flex justify-between gap-4 text-sm">
            <span className="text-slate-500">Service</span>
            <span className="text-right font-semibold text-brand-navy">{serviceType || '—'}</span>
          </div>
          {area ? (
            <div className="flex justify-between gap-4 text-sm">
              <span className="text-slate-500">Area</span>
              <span className="text-right font-medium text-brand-navy">{area}</span>
            </div>
          ) : null}
          <div className="flex justify-between gap-4 text-sm">
            <span className="text-slate-500">Date</span>
            <span className="text-right font-medium text-brand-navy">{formatDate(preferredDate)}</span>
          </div>
          {timeSlot ? (
            <div className="flex justify-between gap-4 text-sm">
              <span className="text-slate-500">Time</span>
              <span className="text-right font-medium text-brand-navy">{timeSlot}</span>
            </div>
          ) : null}
          {guestName ? (
            <div className="flex justify-between gap-4 text-sm">
              <span className="text-slate-500">Name</span>
              <span className="text-right font-medium text-brand-navy">{guestName}</span>
            </div>
          ) : null}

          <div className="border-t border-slate-100 pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Booking deposit</span>
              <span className="font-medium text-brand-navy">£{deposit}</span>
            </div>
            <div className="mt-3 flex justify-between border-t border-dashed border-slate-200 pt-3">
              <span className="font-semibold text-brand-navy">Total due now</span>
              <span className="font-display text-xl font-extrabold text-brand-primary">£{deposit}</span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              Final price may vary by surface size and condition. Balance discussed before work begins.
            </p>
          </div>
        </div>

        <ul className="space-y-3 border-t border-slate-100 bg-slate-50/80 px-6 py-5">
          <li className="flex items-start gap-3 text-sm text-slate-600">
            <FaLock className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" aria-hidden />
            Secure payment via Stripe
          </li>
          <li className="flex items-start gap-3 text-sm text-slate-600">
            <FaCalendarCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" aria-hidden />
            Instant confirmation after payment
          </li>
          <li className="flex items-start gap-3 text-sm text-slate-600">
            <FaHeadset className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" aria-hidden />
            Questions?{' '}
            <a className="font-semibold text-brand-primary hover:underline" href={company.phoneHref}>
              {company.phoneDisplay}
            </a>
          </li>
        </ul>
      </div>

      <p className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
        <FaShieldAlt className="text-brand-primary" aria-hidden />
        No account required — pay by card to secure your slot
      </p>
      <p className="mt-3 text-center text-xs text-slate-500">
        Prefer a quote first?{' '}
        <Link to="/contact" className="font-semibold text-brand-primary hover:underline">
          Contact us
        </Link>
      </p>
    </aside>
  )
}
