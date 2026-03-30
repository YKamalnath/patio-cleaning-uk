import { Booking } from '../models/Booking.js'
import { Gallery } from '../models/Gallery.js'
import { Quote } from '../models/Quote.js'
import { User } from '../models/User.js'
import { sendSuccess } from '../utils/response.js'
import { asyncHandler } from '../utils/asyncHandler.js'

/**
 * Admin dashboard: aggregate counts for quick overview.
 */
export const getDashboardStats = asyncHandler(async (req, res) => {
  const [
    customers,
    bookingsPending,
    bookingsTotal,
    quotesPending,
    quotesTotal,
    galleryItems,
  ] = await Promise.all([
    User.countDocuments({ role: 'customer' }),
    Booking.countDocuments({ status: 'pending' }),
    Booking.countDocuments(),
    Quote.countDocuments({ status: 'pending' }),
    Quote.countDocuments(),
    Gallery.countDocuments(),
  ])

  return sendSuccess(res, {
    data: {
      stats: {
        customers,
        bookings: { total: bookingsTotal, pending: bookingsPending },
        quotes: { total: quotesTotal, pending: quotesPending },
        galleryItems,
      },
    },
  })
})
