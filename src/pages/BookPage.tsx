import { useEffect, useState } from 'react'
import { FaArrowLeft, FaArrowRight, FaShieldAlt } from 'react-icons/fa'
import { toast } from 'sonner'
import { Link, useSearchParams } from 'react-router-dom'
import { BookingStepper } from '../components/booking/BookingStepper'
import { BookingSummary } from '../components/booking/BookingSummary'
import { ServicePicker } from '../components/booking/ServicePicker'
import { bookingSteps, serviceOptions } from '../data/bookingData'
import { company } from '../data/siteData'
import { ApiError, apiGetPublic, apiPost } from '../lib/api'

const fieldClass =
  'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-brand-navy placeholder:text-slate-400 transition-colors duration-200 focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-primary/20'

const STEP_COUNT = bookingSteps.length

export function BookPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [step, setStep] = useState(1)
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [guestPhone, setGuestPhone] = useState('')
  const [serviceType, setServiceType] = useState(serviceOptions[0]?.name ?? '')
  const [preferredDate, setPreferredDate] = useState('')
  const [area, setArea] = useState('')
  const [timeSlot, setTimeSlot] = useState('')
  const [notes, setNotes] = useState('')
  const [busy, setBusy] = useState(false)

  const minDate = new Date().toISOString().slice(0, 10)

  useEffect(() => {
    const paymentState = searchParams.get('payment')
    const sessionId = searchParams.get('session_id')
    if (!paymentState) return

    const run = async () => {
      if (paymentState === 'success' && sessionId) {
        try {
          await apiGetPublic(`/api/public/bookings/confirm-payment?session_id=${encodeURIComponent(sessionId)}`)
          toast.success('Payment received. Your booking is confirmed.')
        } catch (err) {
          const msg = err instanceof ApiError ? err.message : 'Confirmation is still processing — your booking will update shortly.'
          toast.message(msg)
        }
      } else if (paymentState === 'cancelled') {
        toast.message('Payment was cancelled. You can submit again when ready.')
      }
      setSearchParams({}, { replace: true })
    }

    void run()
  }, [searchParams, setSearchParams])

  const validateStep = (targetStep: number): boolean => {
    if (targetStep >= 2 && !serviceType) {
      toast.error('Please select a service.')
      return false
    }
    if (targetStep >= 3 && !preferredDate) {
      toast.error('Please choose your preferred date.')
      return false
    }
    return true
  }

  const goNext = () => {
    if (!validateStep(step + 1)) return
    setStep((s) => Math.min(s + 1, STEP_COUNT))
  }

  const goBack = () => setStep((s) => Math.max(s - 1, 1))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const name = guestName.trim()
    const email = guestEmail.trim()
    if (!name || !email || !serviceType || !preferredDate) {
      toast.error('Please complete all required fields.')
      return
    }

    const preferredDateIso = new Date(preferredDate).toISOString()
    setBusy(true)
    try {
      const res = await apiPost<{
        checkoutUrl?: string
      }>('/api/public/bookings/checkout-session', {
        guestName: name,
        guestEmail: email,
        guestPhone: guestPhone.trim() || undefined,
        serviceType,
        preferredDate: preferredDateIso,
        area: area.trim() || undefined,
        timeSlot: timeSlot.trim() || undefined,
        notes: notes.trim() || undefined,
      })

      const url = res.data.checkoutUrl
      if (!url) {
        throw new Error('Checkout URL missing from server')
      }
      window.location.assign(url)
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : err instanceof Error ? err.message : 'Could not start checkout.'
      toast.error(msg)
    } finally {
      setBusy(false)
    }
  }

  const currentStepMeta = bookingSteps[step - 1]

  return (
    <>
      <section className="relative overflow-hidden bg-brand-gradient py-14 md:py-20">
        <div className="pointer-events-none absolute inset-0 dot-grid-overlay opacity-40" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-label text-brand-accent backdrop-blur-sm">
            <FaShieldAlt aria-hidden />
            Secure booking
          </span>
          <h1 className="mt-5 font-display text-3xl font-extrabold text-white md:text-4xl lg:text-5xl">
            Book your outdoor clean
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-brand-mutedBlue">
            Complete your booking in {STEP_COUNT} simple steps — choose your service, pick a date, then pay securely
            online. No account needed.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:py-14">
        <div className="mb-8 rounded-2xl border border-slate-100 bg-white px-4 py-6 shadow-card sm:px-8">
          <BookingStepper currentStep={step} />
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-10">
          <form
            onSubmit={(e) => void submit(e)}
            className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-premium"
          >
            <header className="border-b border-slate-100 bg-slate-50/60 px-6 py-5 sm:px-8">
              <p className="section-label">{currentStepMeta?.label}</p>
              <h2 className="mt-1 font-display text-xl font-bold text-brand-navy sm:text-2xl">
                {step === 1 && 'Select your service'}
                {step === 2 && 'Choose date & time'}
                {step === 3 && 'Your details & payment'}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Step {step} of {STEP_COUNT}
                {step === 1 && ' — Tell us what you need cleaned and where.'}
                {step === 2 && ' — We will confirm availability by email.'}
                {step === 3 && ' — Review your booking, then continue to secure payment.'}
              </p>
            </header>

            <div className="space-y-6 px-6 py-6 sm:px-8 sm:py-8">
              {step === 1 && (
                <>
                  <div>
                    <h3 className="font-display text-base font-bold text-brand-navy">Service type</h3>
                    <p className="mt-1 text-sm text-slate-500">Choose the service that best fits your property</p>
                    <div className="mt-4">
                      <ServicePicker value={serviceType} onChange={setServiceType} />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="grid gap-1.5 sm:col-span-2">
                      <span className="text-sm font-semibold text-brand-navy">Area / postcode</span>
                      <input
                        className={fieldClass}
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        placeholder="e.g. CR0, Wimbledon, Sutton"
                      />
                      <span className="text-xs text-slate-500">Helps us plan travel and equipment</span>
                    </label>
                    <label className="grid gap-1.5 sm:col-span-2">
                      <span className="text-sm font-semibold text-brand-navy">Property notes (optional)</span>
                      <textarea
                        className={`${fieldClass} min-h-[100px] resize-y`}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Surface type, access, parking, approximate size…"
                        rows={3}
                      />
                    </label>
                  </div>
                </>
              )}

              {step === 2 && (
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
                      onChange={(e) => setPreferredDate(e.target.value)}
                      required
                    />
                  </label>
                  <label className="grid gap-1.5">
                    <span className="text-sm font-semibold text-brand-navy">Preferred time (optional)</span>
                    <select
                      className={fieldClass}
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                    >
                      <option value="">No preference</option>
                      <option value="Morning (8am–12pm)">Morning (8am–12pm)</option>
                      <option value="Afternoon (12pm–5pm)">Afternoon (12pm–5pm)</option>
                      <option value="Flexible">Flexible</option>
                    </select>
                  </label>
                  <p className="sm:col-span-2 text-sm text-slate-500">
                    We will email to confirm your slot. Need a specific time? Call{' '}
                    <a className="font-semibold text-brand-primary hover:underline" href={company.phoneHref}>
                      {company.phoneDisplay}
                    </a>
                    .
                  </p>
                </div>
              )}

              {step === 3 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-1.5 sm:col-span-2">
                    <span className="text-sm font-semibold text-brand-navy">
                      Full name <span className="text-brand-primary">*</span>
                    </span>
                    <input
                      className={fieldClass}
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      autoComplete="name"
                      required
                    />
                  </label>
                  <label className="grid gap-1.5">
                    <span className="text-sm font-semibold text-brand-navy">
                      Email <span className="text-brand-primary">*</span>
                    </span>
                    <input
                      type="email"
                      className={fieldClass}
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      autoComplete="email"
                      required
                    />
                  </label>
                  <label className="grid gap-1.5">
                    <span className="text-sm font-semibold text-brand-navy">Phone (optional)</span>
                    <input
                      type="tel"
                      className={fieldClass}
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      autoComplete="tel"
                    />
                  </label>
                  <p className="sm:col-span-2 text-sm text-slate-600">
                    You will be redirected to Stripe for secure card payment. Already have an account?{' '}
                    <Link to="/portal/login" className="font-semibold text-brand-primary hover:underline">
                      Sign in to the customer portal
                    </Link>
                    .
                  </p>
                </div>
              )}
            </div>

            <footer className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <button
                type="button"
                onClick={goBack}
                disabled={step === 1}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-brand-navy transition hover:border-slate-300 disabled:pointer-events-none disabled:opacity-40"
              >
                <FaArrowLeft className="h-3.5 w-3.5" aria-hidden />
                Previous
              </button>

              {step < STEP_COUNT ? (
                <button
                  type="button"
                  onClick={goNext}
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-brand-primary px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-primaryLight hover:shadow-blue-btn"
                >
                  Continue
                  <FaArrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={busy}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-primary px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-primaryLight hover:shadow-blue-btn disabled:opacity-60"
                >
                  {busy ? 'Redirecting to secure payment…' : 'Continue to payment'}
                  {!busy ? <FaArrowRight aria-hidden /> : null}
                </button>
              )}
            </footer>
          </form>

          <BookingSummary
            serviceType={serviceType}
            preferredDate={preferredDate}
            area={area}
            timeSlot={timeSlot}
            guestName={guestName.trim()}
          />
        </div>
      </section>
    </>
  )
}
