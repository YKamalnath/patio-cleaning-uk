import { FaMapMarkerAlt, FaPhoneAlt, FaWhatsapp } from 'react-icons/fa'
import { FiClock, FiMail } from 'react-icons/fi'
import { ContactForm } from '../components/ContactForm'
import { PageBanner } from '../components/PageBanner'
import { Reveal } from '../components/Reveal'
import { company } from '../data/siteData'

const hours = [
  { day: 'Monday – Friday', time: '8:00am – 6:00pm' },
  { day: 'Saturday', time: '9:00am – 5:00pm' },
  { day: 'Sunday', time: 'Closed' },
]

export function ContactPage() {
  return (
    <>
      <PageBanner
        title="Contact Us"
        description="Call, WhatsApp or send a quote request. We usually respond the same day."
      />

      <section className="bg-brand-offwhite py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-2">
          <Reveal>
            <ContactForm />
          </Reveal>

          <Reveal delay={120} className="space-y-6">
            {/* Direct contact */}
            <article className="rounded-3xl bg-white p-8 shadow-premium">
              <h2 className="font-display text-2xl font-bold text-brand-navy">Direct Contact</h2>
              <ul className="mt-6 space-y-5">
                <li className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary">
                    <FaPhoneAlt className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-brand-muted">Phone</p>
                    <a className="font-display text-lg font-bold text-brand-navy hover:text-brand-primary" href={company.phoneHref}>
                      {company.phoneDisplay}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary">
                    <FiMail className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-brand-muted">Email</p>
                    <a className="font-medium text-brand-navy hover:text-brand-primary" href={`mailto:${company.email}`}>
                      {company.email}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary">
                    <FaMapMarkerAlt className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-brand-muted">Address</p>
                    <p className="font-medium text-brand-navy">{company.address}</p>
                  </div>
                </li>
              </ul>

              <a
                href={company.whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-whatsapp px-6 py-3.5 font-bold text-white transition-all duration-200 hover:brightness-105"
              >
                <FaWhatsapp className="h-5 w-5" /> Start WhatsApp Chat
              </a>
            </article>

            {/* Opening hours */}
            <article className="rounded-3xl bg-white p-8 shadow-premium">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary">
                  <FiClock className="h-5 w-5" />
                </span>
                <h2 className="font-display text-2xl font-bold text-brand-navy">Opening Hours</h2>
              </div>
              <ul className="mt-6 divide-y divide-blue-50">
                {hours.map((h) => (
                  <li key={h.day} className="flex items-center justify-between py-3">
                    <span className="font-medium text-brand-navy">{h.day}</span>
                    <span className="text-brand-muted">{h.time}</span>
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        </div>

        {/* Map */}
        <Reveal className="mx-auto mt-10 max-w-7xl px-4">
          <div className="overflow-hidden rounded-3xl shadow-premium ring-1 ring-black/5">
            <iframe
              title="Outdoor Cleaning Masters location"
              src="https://www.google.com/maps?q=523%20Barlow%20Moor%20Road%2C%20Chorlton%2C%20Manchester%20M21%208AQ&output=embed"
              className="h-80 w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </Reveal>
      </section>
    </>
  )
}
