import { Router } from 'express'
import { body, query } from 'express-validator'
import * as bookingController from '../controllers/booking.controller.js'
import * as galleryController from '../controllers/gallery.controller.js'
import { validateRequest } from '../middleware/validate.js'

const router = Router()

/**
 * Public published gallery for marketing site (no auth).
 * GET /api/public/gallery
 */
router.get('/gallery', galleryController.listPublishedGallery)

/**
 * Guest bookings (no account) — Stripe Checkout then return URLs on /book.
 */
router.post(
  '/bookings/checkout-session',
  [
    body('guestName').trim().notEmpty(),
    body('guestEmail').isEmail().normalizeEmail(),
    body('guestPhone').optional().trim(),
    body('serviceType').trim().notEmpty(),
    body('preferredDate').isISO8601().toDate(),
    body('area').optional().trim(),
    body('timeSlot').optional().trim(),
    body('notes').optional().trim(),
  ],
  validateRequest,
  bookingController.createGuestBookingCheckoutSession,
)

router.get(
  '/bookings/confirm-payment',
  [query('session_id').trim().notEmpty()],
  validateRequest,
  bookingController.confirmGuestBookingPayment,
)

router.post('/stripe/webhook', bookingController.stripeWebhook)

export default router
