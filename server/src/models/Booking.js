import mongoose from 'mongoose'

const bookingSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
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

export const Booking = mongoose.model('Booking', bookingSchema)
