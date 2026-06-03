import { FaCheck } from 'react-icons/fa'
import { serviceOptions } from '../../data/bookingData'

type ServicePickerProps = {
  value: string
  onChange: (service: string) => void
}

export function ServicePicker({ value, onChange }: ServicePickerProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {serviceOptions.map((option) => {
        const selected = value === option.name
        return (
          <button
            key={option.name}
            type="button"
            onClick={() => onChange(option.name)}
            className={`relative rounded-xl border-2 p-4 text-left transition-all duration-200 ${
              selected
                ? 'border-brand-primary bg-brand-primary/5 shadow-[0_8px_24px_rgba(21,101,192,0.12)]'
                : 'border-slate-200 bg-white hover:border-brand-accent/60 hover:shadow-card'
            }`}
            aria-pressed={selected}
          >
            {selected ? (
              <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-brand-primary text-white">
                <FaCheck className="h-3 w-3" aria-hidden />
              </span>
            ) : null}
            <span className="block font-display text-sm font-bold text-brand-navy">{option.name}</span>
            <span className="mt-1 block text-xs leading-relaxed text-slate-500">{option.description}</span>
          </button>
        )
      })}
    </div>
  )
}
