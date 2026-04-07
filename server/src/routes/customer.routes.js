import { Router } from 'express'
import { body, query } from 'express-validator'
import * as bookingController from '../controllers/booking.controller.js'
import * as quoteController from '../controllers/quote.controller.js'
import { authenticate } from '../middleware/auth.js'
import { authorizeRoles } from '../middleware/authorizeRoles.js'
import { validateRequest } from '../middleware/validate.js'

const router = Router()

router.use(authenticate, authorizeRoles('customer'))

/**
 * Customer bookings — create and list own.
 */
router.post(
  '/bookings/checkout-session',
  [
    body('serviceType').trim().notEmpty(),
    body('preferredDate').isISO8601().toDate(),
    body('area').optional().trim(),
    body('timeSlot').optional().trim(),
    body('notes').optional().trim(),
  ],
  validateRequest,
  bookingController.createBookingCheckoutSession,
)

router.post(
  '/bookings',
  [
    body('serviceType').trim().notEmpty(),
    body('preferredDate').isISO8601().toDate(),
    body('area').optional().trim(),
    body('timeSlot').optional().trim(),
    body('notes').optional().trim(),
  ],
  validateRequest,
  bookingController.createBooking,
)

router.get('/bookings', bookingController.listMyBookings)

/**
 * Quote requests — create and list own.
 */
router.post(
  '/quotes',
  [
    body('contactName').trim().notEmpty(),
    body('email').isEmail().normalizeEmail(),
    body('phone').optional().trim(),
    body('postcode').optional().trim(),
    body('serviceSummary').trim().notEmpty(),
    body('message').optional().trim(),
  ],
  validateRequest,
  quoteController.createQuote,
)

router.get(
  '/quotes',
  [query('status').optional().isIn(['pending', 'quoted', 'declined', 'accepted'])],
  validateRequest,
  quoteController.listMyQuotes,
)

export default router
