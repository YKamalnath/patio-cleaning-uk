import { useState } from 'react'
import type { FormEvent } from 'react'
import { FaArrowRight } from 'react-icons/fa'
import { services } from '../data/siteData'
import { ApiError, apiPost } from '../lib/api'

const fieldClass =
  'w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-brand-navy placeholder:text-slate-400 transition-colors duration-200 focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-primary/20'
const fieldErrorClass = 'border-red-500 focus:border-red-500 focus:ring-red-500/20'

type FormState = {
  fullName: string
  phone: string
  email: string
  address: string
  service: string
  message: string
}

type FieldErrors = Partial<Record<keyof FormState, string>>

const initialState: FormState = {
  fullName: '',
  phone: '',
  email: '',
  address: '',
  service: '',
  message: '',
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function ContactForm() {
  const [values, setValues] = useState<FormState>(initialState)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [submitError, setSubmitError] = useState<string | null>(null)

  const update = (field: keyof FormState) => (value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev))
  }

  const validate = (): FieldErrors => {
    const next: FieldErrors = {}
    if (!values.fullName.trim()) next.fullName = 'Please enter your full name.'
    if (!values.phone.trim()) next.phone = 'Please enter your phone number.'
    if (!values.email.trim()) next.email = 'Please enter your email.'
    else if (!emailPattern.test(values.email.trim())) next.email = 'Please enter a valid email.'
    if (!values.address.trim()) next.address = 'Please enter your address.'
    if (!values.service) next.service = 'Please select a service.'
    return next
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      setStatus('idle')
      setSubmitError(null)
      return
    }

    setStatus('submitting')
    setSubmitError(null)
    try {
      await apiPost('/api/public/quotes', {
        contactName: values.fullName.trim(),
        phone: values.phone.trim(),
        email: values.email.trim(),
        address: values.address.trim(),
        service: values.service,
        message: values.message.trim(),
      })
      setStatus('success')
      setValues(initialState)
      setErrors({})
    } catch (err) {
      setStatus('error')
      setSubmitError(
        err instanceof ApiError
          ? err.message
          : 'Sorry, something went wrong. Please try again or call us directly.',
      )
    }
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="grid gap-4 rounded-2xl bg-white p-8 shadow-xl">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <input
            className={`${fieldClass} ${errors.fullName ? fieldErrorClass : ''}`}
            placeholder="Full Name"
            aria-label="Full Name"
            aria-invalid={errors.fullName ? true : undefined}
            value={values.fullName}
            onChange={(e) => update('fullName')(e.target.value)}
          />
          {errors.fullName ? <p className="mt-1 text-sm text-red-600">{errors.fullName}</p> : null}
        </div>
        <div>
          <input
            className={`${fieldClass} ${errors.phone ? fieldErrorClass : ''}`}
            placeholder="Phone Number"
            aria-label="Phone Number"
            aria-invalid={errors.phone ? true : undefined}
            value={values.phone}
            onChange={(e) => update('phone')(e.target.value)}
          />
          {errors.phone ? <p className="mt-1 text-sm text-red-600">{errors.phone}</p> : null}
        </div>
      </div>
      <div>
        <input
          className={`${fieldClass} ${errors.email ? fieldErrorClass : ''}`}
          placeholder="Email"
          type="email"
          aria-label="Email"
          aria-invalid={errors.email ? true : undefined}
          value={values.email}
          onChange={(e) => update('email')(e.target.value)}
        />
        {errors.email ? <p className="mt-1 text-sm text-red-600">{errors.email}</p> : null}
      </div>
      <div>
        <input
          className={`${fieldClass} ${errors.address ? fieldErrorClass : ''}`}
          placeholder="Address"
          aria-label="Address"
          aria-invalid={errors.address ? true : undefined}
          value={values.address}
          onChange={(e) => update('address')(e.target.value)}
        />
        {errors.address ? <p className="mt-1 text-sm text-red-600">{errors.address}</p> : null}
      </div>
      <div>
        <select
          className={`${fieldClass} ${errors.service ? fieldErrorClass : ''}`}
          aria-label="Service Required"
          aria-invalid={errors.service ? true : undefined}
          value={values.service}
          onChange={(e) => update('service')(e.target.value)}
        >
          <option value="" disabled>
            Service Required
          </option>
          {services.map((service) => (
            <option key={service} value={service}>
              {service}
            </option>
          ))}
        </select>
        {errors.service ? <p className="mt-1 text-sm text-red-600">{errors.service}</p> : null}
      </div>
      <textarea
        className={`${fieldClass} min-h-[120px] resize-y`}
        placeholder="Tell us about your project"
        aria-label="Message"
        value={values.message}
        onChange={(e) => update('message')(e.target.value)}
      />

      {status === 'success' ? (
        <p className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800" role="status">
          Thanks! We&apos;ll be in touch shortly.
        </p>
      ) : null}
      {status === 'error' ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800" role="alert">
          {submitError ?? 'Sorry, something went wrong. Please try again or call us directly.'}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="group inline-flex items-center justify-center gap-2 rounded-lg bg-brand-primary py-4 font-bold text-white transition-all duration-200 hover:brightness-[1.15] hover:shadow-[0_8px_25px_rgba(21,101,192,0.4)] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === 'submitting' ? 'Sending…' : 'Request Free Quote'}
        <FaArrowRight className="transition-transform duration-200 group-hover:translate-x-1.5" />
      </button>
    </form>
  )
}
