import { useEffect, useId } from 'react'
import { FaLock, FaShieldAlt } from 'react-icons/fa'
import { FiX } from 'react-icons/fi'
import { bookingDepositGbp } from '../../data/bookingData'
import { ServicePicker } from './ServicePicker'

const fieldClass =
  'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-brand-navy placeholder:text-slate-400 transition-colors duration-200 focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-primary/20'

export type CustomerBookingModalProps = {
  open: boolean
  serviceType: string
  preferredDate: string
  area: string
  timeSlot: string
  notes: string
  submitBusy: boolean
  submitError: string | null
  onServiceTypeChange: (value: string) => void
  onPreferredDateChange: (value: string) => void
  onAreaChange: (value: string) => void
  onTimeSlotChange: (value: string) => void
  onNotesChange: (value: string) => void
  onClose: () => void
  onSubmit: () => void
}

function formatSummaryDate(isoDate: string) {
  if (!isoDate) return 'Select a date'
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

export function CustomerBookingModal({
  open,
  serviceType,
  preferredDate,
  area,
  timeSlot,
  notes,
  submitBusy,
  submitError,
  onServiceTypeChange,
  onPreferredDateChange,
  onAreaChange,
  onTimeSlotChange,
  onNotesChange,
  onClose,
  onSubmit,
}: CustomerBookingModalProps) {
  const titleId = useId()
  const descId = useId()
  const minDate = new Date().toISOString().slice(0, 10)
  const deposit = bookingDepositGbp.toFixed(2)

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !submitBusy) onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onClose, submitBusy])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/55 p-0 backdrop-blur-[2px] sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descId}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !submitBusy) onClose()
      }}
    >
      <div className="flex max-h-[min(92vh,720px)] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl border border-slate-200 bg-white shadow-2xl sm:rounded-2xl">
        <header className="relative shrink-0 border-b border-slate-100 bg-brand-navy px-5 py-5 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            disabled={submitBusy}
            className="absolute right-3 top-3 rounded-lg p-2 text-white/70 transition hover:bg-white/10 hover:text-white disabled:opacity-40 sm:right-4 sm:top-4"
            aria-label="Close booking form"
          >
            <FiX size={20} aria-hidden />
          </button>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-brand-accent">
            <FaShieldAlt className="h-3 w-3" aria-hidden />
            Secure booking
          </span>
          <h2 id={titleId} className="mt-3 pr-10 font-display text-xl font-bold text-white sm:text-2xl">
            Book your outdoor clean
          </h2>
          <p id={descId} className="mt-1.5 max-w-lg text-sm leading-relaxed text-brand-mutedBlue">
            Choose your service and preferred date. You will complete payment securely via Stripe to confirm your slot.
          </p>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="grid gap-0 lg:grid-cols-[1fr_minmax(220px,260px)]">
            <form
              className="space-y-6 px-5 py-5 sm:px-6 sm:py-6"
              onSubmit={(e) => {
                e.preventDefault()
                onSubmit()
              }}
            >
              <fieldset className="space-y-3 border-0 p-0">
                <legend className="font-display text-sm font-bold text-brand-navy">Service</legend>
                <p className="text-xs text-slate-500">Select the treatment that best matches your property</p>
                <ServicePicker value={serviceType} onChange={onServiceTypeChange} />
              </fieldset>

              <fieldset className="space-y-4 border-0 border-t border-slate-100 p-0 pt-6">
                <legend className="font-display text-sm font-bold text-brand-navy">Location & access</legend>
                <label className="grid gap-1.5">
                  <span className="text-sm font-semibold text-brand-navy">Area / postcode</span>
                  <input
                    type="text"
                    className={fieldClass}
                    value={area}
                    onChange={(e) => onAreaChange(e.target.value)}
                    placeholder="e.g. CR0, Wimbledon, Sutton"
                    autoComplete="street-address"
                  />
                  <span className="text-xs text-slate-500">Helps us plan travel and equipment</span>
                </label>
                <label className="grid gap-1.5">
                  <span className="text-sm font-semibold text-brand-navy">Notes (optional)</span>
                  <textarea
                    className={`${fieldClass} min-h-[88px] resize-y`}
                    value={notes}
                    onChange={(e) => onNotesChange(e.target.value)}
                    rows={3}
                    placeholder="Surface type, access, parking, approximate size…"
                  />
                </label>
              </fieldset>

              <fieldset className="space-y-4 border-0 border-t border-slate-100 p-0 pt-6">
                <legend className="font-display text-sm font-bold text-brand-navy">Schedule</legend>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-1.5">
                    <span className="text-sm font-semibold text-brand-navy">
                      Preferred date <span className="text-brand-primary">*</span>
                    </span>
                    <input
                      type="date"
                      className={fieldClass}
                      value={preferredDate}
                      min={minDate}
                      onChange={(e) => onPreferredDateChange(e.target.value)}
                      required
                    />
                  </label>
                  <label className="grid gap-1.5">
                    <span className="text-sm font-semibold text-brand-navy">Preferred time</span>
                    <select
                      className={fieldClass}
                      value={timeSlot}
                      onChange={(e) => onTimeSlotChange(e.target.value)}
                    >
                      <option value="">No preference</option>
                      <option value="Morning (8am–12pm)">Morning (8am–12pm)</option>
                      <option value="Afternoon (12pm–5pm)">Afternoon (12pm–5pm)</option>
                      <option value="Flexible">Flexible</option>
                    </select>
                  </label>
                </div>
                <p className="text-xs leading-relaxed text-slate-500">
                  We will confirm your slot by email after payment. Final pricing may vary by surface size and condition.
                </p>
              </fieldset>

              {submitError ? (
                <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800" role="alert">
                  {submitError}
                </p>
              ) : null}
            </form>

            <aside className="border-t border-slate-100 bg-slate-50/80 px-5 py-5 lg:border-l lg:border-t-0 lg:px-5">
              <h3 className="font-display text-sm font-bold text-brand-navy">Summary</h3>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500">Service</dt>
                  <dd className="text-right font-semibold text-brand-navy">{serviceType || '—'}</dd>
                </div>
                {area.trim() ? (
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-500">Area</dt>
                    <dd className="text-right font-medium text-brand-navy">{area.trim()}</dd>
                  </div>
                ) : null}
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500">Date</dt>
                  <dd className="text-right font-medium text-brand-navy">{formatSummaryDate(preferredDate)}</dd>
                </div>
                {timeSlot ? (
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-500">Time</dt>
                    <dd className="text-right font-medium text-brand-navy">{timeSlot}</dd>
                  </div>
                ) : null}
              </dl>
              <div className="mt-5 border-t border-dashed border-slate-200 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Booking deposit</span>
                  <span className="font-medium text-brand-navy">£{deposit}</span>
                </div>
                <div className="mt-2 flex justify-between">
                  <span className="text-sm font-semibold text-brand-navy">Due now</span>
                  <span className="font-display text-lg font-extrabold text-brand-primary">£{deposit}</span>
                </div>
              </div>
              <p className="mt-4 flex items-start gap-2 text-xs text-slate-500">
                <FaLock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-primary" aria-hidden />
                Card payment processed securely by Stripe. Instant confirmation after payment.
              </p>
            </aside>
          </div>
        </div>

        <footer className="flex shrink-0 flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/90 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <button
            type="button"
            onClick={onClose}
            disabled={submitBusy}
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-brand-navy transition hover:border-slate-300 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={submitBusy}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-primary px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-primaryLight hover:shadow-blue-btn disabled:opacity-60"
          >
            <FaLock className="h-3.5 w-3.5" aria-hidden />
            {submitBusy ? 'Redirecting to secure payment…' : 'Continue to payment'}
          </button>
        </footer>
      </div>
    </div>
  )
}
