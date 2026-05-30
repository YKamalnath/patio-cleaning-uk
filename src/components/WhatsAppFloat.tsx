import { FaWhatsapp } from 'react-icons/fa'
import { company } from '../data/siteData'

export function WhatsAppFloat() {
  return (
    <a
      href={company.whatsappHref}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="group fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-premium transition-transform duration-200 hover:scale-110"
    >
      <span className="absolute inset-0 rounded-full bg-whatsapp animate-pulse-ring" aria-hidden="true" />
      <FaWhatsapp size={28} className="relative" />
      <span className="pointer-events-none absolute right-16 whitespace-nowrap rounded-lg bg-brand-navy px-3 py-1.5 text-sm font-medium text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
        Chat with us
      </span>
    </a>
  )
}
