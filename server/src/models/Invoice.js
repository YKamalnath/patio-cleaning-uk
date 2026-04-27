import mongoose from 'mongoose'

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true, trim: true },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
      unique: true,
      index: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
      index: true,
    },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, lowercase: true, trim: true },
    stripeCheckoutSessionId: { type: String, trim: true, index: true },
    stripePaymentIntentId: { type: String, trim: true },
    status: { type: String, enum: ['paid'], default: 'paid' },
    issuedAt: { type: Date, default: Date.now },
    paidAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
)

export const Invoice = mongoose.model('Invoice', invoiceSchema)
