import { ContactForm } from '../components/ContactForm'
import { PageBanner } from '../components/PageBanner'
import { company } from '../data/siteData'

export function ContactPage() {
  return (
    <>
      <PageBanner title="Contact Us" description="Call, WhatsApp or send a quote request. We usually respond the same day." />
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-8 lg:grid-cols-2">
          <ContactForm />
          <article className="rounded-3xl bg-white p-8 shadow-premium">
            <h2 className="text-2xl font-bold text-brand-navy">Direct Contact</h2>
            <p className="mt-4 text-slate-600">Phone: <a className="font-semibold text-brand-blue" href={company.phoneHref}>{company.phoneDisplay}</a></p>
            <p className="mt-2 text-slate-600">Email: <a className="font-semibold text-brand-blue" href={`mailto:${company.email}`}>{company.email}</a></p>
            <p className="mt-2 text-slate-600">Address: {company.address}</p>
            <a href={company.whatsappHref} target="_blank" rel="noreferrer" className="mt-6 inline-block rounded-full bg-brand-green px-6 py-3 font-semibold text-white">
              Start WhatsApp Chat
            </a>
          </article>
        </div>
      </section>
    </>
  )
}
