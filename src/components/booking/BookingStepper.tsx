import { FaCheck } from 'react-icons/fa'
import { bookingSteps } from '../../data/bookingData'

type BookingStepperProps = {
  currentStep: number
}

export function BookingStepper({ currentStep }: BookingStepperProps) {
  return (
    <nav aria-label="Booking progress" className="w-full">
      <ol className="flex items-center justify-between gap-2 sm:gap-4">
        {bookingSteps.map((step, index) => {
          const done = currentStep > step.id
          const active = currentStep === step.id
          const isLast = index === bookingSteps.length - 1

          return (
            <li key={step.id} className={`flex min-w-0 flex-1 items-center ${isLast ? '' : ''}`}>
              <div className="flex min-w-0 flex-1 flex-col items-center gap-2 sm:flex-row sm:items-center sm:gap-3">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                    done
                      ? 'bg-brand-primary text-white'
                      : active
                        ? 'bg-brand-primary text-white ring-4 ring-brand-primary/20'
                        : 'border-2 border-slate-200 bg-white text-slate-400'
                  }`}
                  aria-current={active ? 'step' : undefined}
                >
                  {done ? <FaCheck className="h-3.5 w-3.5" aria-hidden /> : step.id}
                </span>
                <span className="hidden text-center sm:block sm:text-left">
                  <span
                    className={`block text-xs font-semibold uppercase tracking-wide ${
                      active || done ? 'text-brand-primary' : 'text-slate-400'
                    }`}
                  >
                    {step.short}
                  </span>
                  <span
                    className={`mt-0.5 block truncate text-sm font-medium ${
                      active ? 'text-brand-navy' : done ? 'text-slate-600' : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </span>
              </div>
              {!isLast ? (
                <div
                  className={`mx-2 hidden h-0.5 flex-1 sm:block ${done ? 'bg-brand-primary' : 'bg-slate-200'}`}
                  aria-hidden
                />
              ) : null}
            </li>
          )
        })}
      </ol>
      <p className="mt-4 text-center text-sm text-slate-500 sm:hidden">
        Step {currentStep} of {bookingSteps.length}:{' '}
        <span className="font-semibold text-brand-navy">{bookingSteps[currentStep - 1]?.label}</span>
      </p>
    </nav>
  )
}
