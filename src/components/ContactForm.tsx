import { FaArrowRight } from 'react-icons/fa'
import { services } from '../data/siteData'

const fieldClass =
  'w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-brand-navy placeholder:text-slate-400 transition-colors duration-200 focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-primary/20'

export function ContactForm() {
  return (
    <form className="grid gap-4 rounded-2xl bg-white p-8 shadow-xl">
      <div className="grid gap-4 sm:grid-cols-2">
        <input className={fieldClass} placeholder="Full Name" aria-label="Full Name" />
        <input className={fieldClass} placeholder="Phone Number" aria-label="Phone Number" />
      </div>
      <input className={fieldClass} placeholder="Email" type="email" aria-label="Email" />
      <input className={fieldClass} placeholder="Address" aria-label="Address" />
      <select className={fieldClass} aria-label="Service Required" defaultValue="">
        <option value="" disabled>
          Service Required
        </option>
        {services.map((service) => (
          <option key={service} value={service}>
            {service}
          </option>
        ))}
      </select>
      <textarea
        className={`${fieldClass} min-h-[120px] resize-y`}
        placeholder="Tell us about your project"
        aria-label="Message"
      />
      <button
        type="button"
        className="group inline-flex items-center justify-center gap-2 rounded-lg bg-brand-primary py-4 font-bold text-white transition-all duration-200 hover:brightness-[1.15] hover:shadow-[0_8px_25px_rgba(21,101,192,0.4)]"
      >
        Request Free Quote
        <FaArrowRight className="transition-transform duration-200 group-hover:translate-x-1.5" />
      </button>
    </form>
  )
}
