import { FaWhatsapp } from 'react-icons/fa'
import { company } from '../data/siteData'

export function WhatsAppFloat() {
  return (
    <a
      href={company.whatsappHref}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 rounded-full bg-brand-green p-4 text-white shadow-premium transition hover:scale-105"
    >
      <FaWhatsapp size={26} />
    </a>
  )
}
