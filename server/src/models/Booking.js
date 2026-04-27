import mongoose from 'mongoose'

const bookingSchema = new mongoose.Schema(
  {
    /** Registered customer account; omit for guest (walk-in) bookings. */
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
      default: undefined,
      index: true,
    },
    /** Guest contact — required when `customer` is not set (validated in pre-validate). */
    guestName: { type: String, trim: true },
    guestEmail: { type: String, trim: true, lowercase: true },
    guestPhone: { type: String, trim: true },
    serviceType: { type: String, required: true, trim: true },
    area: { type: String, trim: true },
    preferredDate: { type: Date, required: true },
    timeSlot: { type: String, trim: true },
    notes: { type: String, trim: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid', 'failed', 'refunded'],
      default: 'unpaid',
      index: true,
    },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'gbp', lowercase: true, trim: true },
    stripeCheckoutSessionId: { type: String, trim: true, index: true },
    stripePaymentIntentId: { type: String, trim: true },
  },
  { timestamps: true },
)

bookingSchema.pre('validate', function bookingContactGuard(next) {
  const hasAccount = !!this.customer
  const guestEmail = typeof this.guestEmail === 'string' ? this.guestEmail.trim() : ''
  const guestName = typeof this.guestName === 'string' ? this.guestName.trim() : ''
  const hasGuest = Boolean(guestEmail && guestName)
  if (!hasAccount && !hasGuest) {
    this.invalidate('guestEmail', 'Guest name and email are required when booking without an account.')
  }
  next()
})

export const Booking = mongoose.model('Booking', bookingSchema)
