import { FaArrowRight, FaCheck, FaPhoneAlt, FaStar, FaWhatsapp } from 'react-icons/fa'
import { ContactForm } from '../components/ContactForm'
import { company, services } from '../data/siteData'

const serviceHighlights = services.map((title, idx) => ({
  title,
  description: [
    'Deep surface restoration with safe pressure control.',
    'Oil stain and organic growth removal with premium finish.',
    'Professional equipment and same-week scheduling available.',
  ][idx % 3],
}))

const testimonials = [
  {
    name: 'Sarah M., Bromley',
    role: 'Homeowner',
    quote: 'They transformed our patio in one visit. It looks like a brand-new installation.',
  },
  {
    name: 'David R., Croydon',
    role: 'Landlord',
    quote: 'Fast response, clear quote, and excellent final result. Great communication throughout.',
  },
  {
    name: 'Anita L., Sutton',
    role: 'Property Manager',
    quote: 'Professional, punctual, and spotless cleanup after the work. Highly recommended team.',
  },
]

const pricing = [
  { name: 'Essential Clean', price: 'From GBP79', features: ['Small patio refresh', 'Weed and debris clear', 'Rinse and tidy finish'] },
  { name: 'Premium Restore', price: 'From GBP149', features: ['Patio + pathway deep clean', 'Moss and algae treatment', 'Seal-ready surface prep'] },
  { name: 'Signature Exterior', price: 'From GBP249', features: ['Patio + driveway package', 'High-pressure detail wash', 'Priority booking slot'] },
]

export function HomePage() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[linear-gradient(125deg,#020617_10%,#082f49_45%,#1d4ed8_100%)]" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600566752227-8f3b1bc0b28f?auto=format&fit=crop&w=2200&q=80')] bg-cover bg-center opacity-20 mix-blend-screen" />
        <div className="absolute -left-28 top-10 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute -right-28 bottom-10 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-20 md:grid-cols-2 md:py-28">
          <div className="fade-up">
            <p className="inline-flex items-center rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100">
              Premium Exterior Cleaning
            </p>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight text-white md:text-6xl">
              Professional Patio Cleaning Services
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-200 md:text-lg">
              Bring your patio back to life with expert pressure washing and deep outdoor cleaning. Fast, affordable, and reliable service.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#quote" className="group rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400">
                Get Free Quote <FaArrowRight className="ml-2 inline transition group-hover:translate-x-1" />
              </a>
              <a href={company.phoneHref} className="rounded-full border border-slate-200/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-100/10">
                <FaPhoneAlt className="mr-2 inline" /> Call Now
              </a>
              <a href={company.whatsappHref} target="_blank" rel="noreferrer" className="rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300">
                <FaWhatsapp className="mr-2 inline" /> WhatsApp Us
              </a>
            </div>
          </div>

          <div className="glass-card fade-up fade-up-delay-2 rounded-3xl p-6 shadow-premium">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Projects Completed', value: '2,400+' },
                { label: 'Average Review Score', value: '4.9/5' },
                { label: 'Same-Day Response', value: '< 30 mins' },
                { label: 'Local Coverage', value: '35+ Areas' },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl bg-white/10 p-4">
                  <p className="text-xl font-bold text-white">{item.value}</p>
                  <p className="mt-1 text-xs text-cyan-100">{item.label}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-slate-100">
              Fully insured specialists using commercial-grade systems for patios, driveways, decking and pathways.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:py-24">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600">Services</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">High-Performance Exterior Cleaning</h2>
          </div>
          <a href="#quote" className="text-sm font-semibold text-blue-700 hover:text-blue-600">
            See pricing and availability
          </a>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {serviceHighlights.map((service, i) => (
            <article key={service.title} className={`fade-up fade-up-delay-${(i % 3) + 1} group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-premium`}>
              <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 p-2 text-white">
                <FaCheck />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{service.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{service.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-slate-900 py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Transformation</p>
            <h2 className="mt-2 text-3xl font-bold text-white md:text-4xl">See The Difference In One Visit</h2>
            <p className="mt-4 max-w-xl text-slate-300">
              We remove deep dirt, moss, algae and black spot staining to deliver a cleaner, safer and more premium-looking outdoor space.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-200">
              <span className="rounded-full bg-white/10 px-4 py-2">Eco-safe products</span>
              <span className="rounded-full bg-white/10 px-4 py-2">Commercial equipment</span>
              <span className="rounded-full bg-white/10 px-4 py-2">Insured professionals</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img className="h-48 w-full rounded-3xl object-cover transition hover:scale-[1.02]" src="https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&w=900&q=80" alt="Patio surface before cleaning" />
            <img className="h-48 w-full rounded-3xl object-cover transition hover:scale-[1.02]" src="https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=900&q=80" alt="Patio surface after cleaning" />
            <img className="col-span-2 h-60 w-full rounded-3xl object-cover transition hover:scale-[1.02]" src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80" alt="Premium finished patio" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:py-24">
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600">Testimonials</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">Trusted By Homeowners Across The UK</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((item) => (
            <article key={item.name} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-premium">
              <div className="mb-3 flex text-amber-400">
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
              </div>
              <p className="text-slate-600">"{item.quote}"</p>
              <p className="mt-4 text-sm font-semibold text-slate-900">{item.name}</p>
              <p className="text-xs text-slate-500">{item.role}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600">Transparent Pricing</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">Packages For Every Property Size</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {pricing.map((plan) => (
              <article key={plan.name} className="rounded-3xl border border-slate-200 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-premium">
                <h3 className="text-xl font-semibold text-slate-900">{plan.name}</h3>
                <p className="mt-2 text-3xl font-extrabold text-blue-700">{plan.price}</p>
                <ul className="mt-5 space-y-2 text-sm text-slate-600">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <FaCheck className="mt-1 text-emerald-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <a href="#quote" className="mt-6 inline-block rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
                  Select Package
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="quote" className="mx-auto max-w-7xl px-4 py-16 md:py-24">
        <div className="mb-10 rounded-3xl bg-gradient-to-r from-slate-900 via-blue-900 to-cyan-900 p-8 text-white shadow-premium">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">Ready To Book?</p>
          <h2 className="mt-2 text-3xl font-bold md:text-4xl">Claim Your Free Patio Assessment This Week</h2>
          <p className="mt-3 max-w-2xl text-slate-200">
            Share your details below and we will send a tailored quote with clear pricing and next available appointment times.
          </p>
        </div>
        <div className="grid items-start gap-8 lg:grid-cols-2">
          <ContactForm />
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-premium">
            <iframe
              title="Google Map"
              className="h-80 w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps?q=Croydon%20London&output=embed"
            />
            <div className="p-6 text-sm text-slate-700">
              <p>{company.address}</p>
              <p className="mt-1">{company.phoneDisplay}</p>
              <a href={company.phoneHref} className="mt-4 inline-block rounded-full bg-emerald-500 px-5 py-2 font-semibold text-white transition hover:bg-emerald-600">
                Call For Instant Quote
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
