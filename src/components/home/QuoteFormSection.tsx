import { FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa'
import { company } from '../../data/siteData'
import { ContactForm } from '../ContactForm'
import { Reveal } from '../Reveal'

export function QuoteFormSection() {
  return (
    <section id="quote" className="relative overflow-hidden bg-quote-gradient py-20 md:py-28">
      <div className="dot-grid-overlay pointer-events-none absolute inset-0 opacity-25" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-brand-accent/15 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4">
        <Reveal className="mx-auto mb-12 max-w-2xl text-center">
          <p className="section-label">Ready To Book?</p>
          <h2 className="mt-3 font-display text-3xl font-extrabold text-white sm:text-4xl md:text-5xl">
            Claim Your Free Patio Assessment This Week
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-brand-mutedBlue">
            Share your details below and we will send a tailored quote with clear pricing and next available appointment times.
          </p>
        </Reveal>

        <div className="grid items-start gap-8 lg:grid-cols-2">
          <Reveal>
            <ContactForm />
          </Reveal>

          <Reveal delay={120}>
            <div className="glass-card overflow-hidden rounded-2xl shadow-blue-glow">
              <iframe
                title="Google Map"
                className="h-72 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps?q=Croydon%20London&output=embed"
              />
              <div className="p-7">
                <div className="flex items-start gap-3 text-white">
                  <FaMapMarkerAlt className="mt-1 h-4 w-4 shrink-0 text-brand-accent" />
                  <p>{company.address}</p>
                </div>
                <div className="mt-3 flex items-center gap-3 text-white">
                  <FaPhoneAlt className="h-4 w-4 shrink-0 text-brand-accent" />
                  <p>{company.phoneDisplay}</p>
                </div>
                <a
                  href={company.phoneHref}
                  className="mt-6 inline-flex w-full items-center justify-center rounded-lg border border-brand-accent px-5 py-3 font-bold text-brand-accent transition-colors duration-200 hover:bg-brand-accent hover:text-white"
                >
                  Call For Instant Quote
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
