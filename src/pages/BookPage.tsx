import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Link, useSearchParams } from 'react-router-dom'
import { PageBanner } from '../components/PageBanner'
import { company, services } from '../data/siteData'
import { ApiError, apiGetPublic, apiPost } from '../lib/api'

export function BookPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [guestPhone, setGuestPhone] = useState('')
  const [serviceType, setServiceType] = useState(services[0] ?? '')
  const [preferredDate, setPreferredDate] = useState('')
  const [area, setArea] = useState('')
  const [timeSlot, setTimeSlot] = useState('')
  const [notes, setNotes] = useState('')
  const [busy, setBusy] = useState(false)

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

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const name = guestName.trim()
    const email = guestEmail.trim()
    if (!name || !email || !serviceType || !preferredDate) {
      toast.error('Please enter your name, email, service, and preferred date.')
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

  return (
    <>
      <PageBanner
        title="Book a clean"
        description="Reserve a slot with secure card payment — no account needed. We will confirm details by email."
      />
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <form onSubmit={(e) => void submit(e)} className="grid gap-4 rounded-3xl bg-white p-6 shadow-premium">
            <h2 className="text-xl font-bold text-brand-navy">Your details</h2>
            <label className="grid gap-1">
              <span className="text-sm font-medium text-slate-700">Full name</span>
              <input
                className="rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-brand-blue"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                autoComplete="name"
                required
              />
            </label>
            <label className="grid gap-1">
              <span className="text-sm font-medium text-slate-700">Email</span>
              <input
                type="email"
                className="rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-brand-blue"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </label>
            <label className="grid gap-1">
              <span className="text-sm font-medium text-slate-700">Phone (optional)</span>
              <input
                type="tel"
                className="rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-brand-blue"
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                autoComplete="tel"
              />
            </label>

            <h2 className="mt-2 text-xl font-bold text-brand-navy">Job details</h2>
            <label className="grid gap-1">
              <span className="text-sm font-medium text-slate-700">Service</span>
              <select
                className="rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-brand-blue"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                required
              >
                {services.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1">
              <span className="text-sm font-medium text-slate-700">Preferred date</span>
              <input
                type="date"
                className="rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-brand-blue"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                required
              />
            </label>
            <label className="grid gap-1">
              <span className="text-sm font-medium text-slate-700">Area / postcode (optional)</span>
              <input
                className="rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-brand-blue"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="e.g. CR0 or Wimbledon"
              />
            </label>
            <label className="grid gap-1">
              <span className="text-sm font-medium text-slate-700">Preferred time (optional)</span>
              <input
                className="rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-brand-blue"
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                placeholder="e.g. Morning, after 2pm"
              />
            </label>
            <label className="grid gap-1">
              <span className="text-sm font-medium text-slate-700">Notes (optional)</span>
              <textarea
                className="min-h-24 rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-brand-blue"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Access, parking, surface type…"
                rows={3}
              />
            </label>

            <p className="text-sm text-slate-600">
              You will be redirected to Stripe to pay securely. Already have an account?{' '}
              <Link to="/portal/login" className="font-semibold text-brand-blue hover:underline">
                Sign in
              </Link>{' '}
              to manage bookings in the customer portal.
            </p>

            <button
              type="submit"
              disabled={busy}
              className="rounded-full bg-brand-green px-6 py-3 font-semibold text-white transition hover:bg-green-600 disabled:opacity-60"
            >
              {busy ? 'Redirecting to secure payment…' : 'Continue to payment'}
            </button>
          </form>

          <article className="rounded-3xl bg-white p-8 shadow-premium">
            <h2 className="text-2xl font-bold text-brand-navy">Why book online?</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-600">
              <li>No registration — pay by card and we hold your slot.</li>
              <li>Instant confirmation after successful payment.</li>
              <li>Questions? Call{' '}
                <a className="font-semibold text-brand-blue" href={company.phoneHref}>
                  {company.phoneDisplay}
                </a>{' '}
                or{' '}
                <a href={company.whatsappHref} className="font-semibold text-brand-blue" target="_blank" rel="noreferrer">
                  WhatsApp
                </a>
                .
              </li>
            </ul>
            <p className="mt-6 text-sm text-slate-500">
              Prefer a custom quote first? Use the{' '}
              <Link to="/contact" className="font-semibold text-brand-blue hover:underline">
                contact form
              </Link>
              .
            </p>
          </article>
        </div>
      </section>
    </>
  )
}
