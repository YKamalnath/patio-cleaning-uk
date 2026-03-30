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
  },
  { timestamps: true },
)

export const Booking = mongoose.model('Booking', bookingSchema)
