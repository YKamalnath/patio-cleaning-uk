import mongoose from 'mongoose'

const quoteSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    contactName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    postcode: { type: String, trim: true },
    serviceSummary: { type: String, required: true, trim: true },
    message: { type: String, trim: true },
    status: {
      type: String,
      enum: ['pending', 'quoted', 'declined', 'accepted'],
      default: 'pending',
    },
    quotedAmount: { type: Number, min: 0 },
    adminNotes: { type: String, trim: true },
  },
  { timestamps: true },
)

export const Quote = mongoose.model('Quote', quoteSchema)
