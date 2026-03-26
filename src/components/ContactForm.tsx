import { services } from '../data/siteData'

export function ContactForm() {
  return (
    <form className="grid gap-4 rounded-3xl bg-white p-6 shadow-premium">
      <input className="rounded-xl border border-slate-200 px-4 py-3" placeholder="Full Name" aria-label="Full Name" />
      <input className="rounded-xl border border-slate-200 px-4 py-3" placeholder="Phone Number" aria-label="Phone Number" />
      <input className="rounded-xl border border-slate-200 px-4 py-3" placeholder="Email" type="email" aria-label="Email" />
      <input className="rounded-xl border border-slate-200 px-4 py-3" placeholder="Address" aria-label="Address" />
      <select className="rounded-xl border border-slate-200 px-4 py-3" aria-label="Service Required" defaultValue="">
        <option value="" disabled>
          Service Required
        </option>
        {services.map((service) => (
          <option key={service} value={service}>
            {service}
          </option>
        ))}
      </select>
      <textarea className="min-h-28 rounded-xl border border-slate-200 px-4 py-3" placeholder="Message" aria-label="Message" />
      <button type="button" className="rounded-full bg-brand-green px-6 py-3 font-semibold text-white transition hover:bg-green-600">
        Request Free Quote
      </button>
    </form>
  )
}
