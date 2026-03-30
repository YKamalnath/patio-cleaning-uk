import { Router } from 'express'
import { body, param, query } from 'express-validator'
import * as adminController from '../controllers/admin.controller.js'
import * as bookingController from '../controllers/booking.controller.js'
import * as dashboardController from '../controllers/dashboard.controller.js'
import * as galleryController from '../controllers/gallery.controller.js'
import * as quoteController from '../controllers/quote.controller.js'
import { authenticate } from '../middleware/auth.js'
import { authorizeRoles } from '../middleware/authorizeRoles.js'
import { validateRequest } from '../middleware/validate.js'

const router = Router()

router.use(authenticate, authorizeRoles('admin'))

/** GET /api/admin/dashboard/stats */
router.get('/dashboard/stats', dashboardController.getDashboardStats)

/** Customers */
router.get(
  '/customers',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
  ],
  validateRequest,
  adminController.listCustomers,
)

router.get('/customers/:id', [param('id').isMongoId()], validateRequest, adminController.getCustomerById)

router.patch(
  '/customers/:id',
  [
    param('id').isMongoId(),
    body('name').optional().trim().notEmpty(),
    body('email').optional().isEmail().normalizeEmail(),
  ],
  validateRequest,
  adminController.updateCustomer,
)

router.delete(
  '/customers/:id',
  [param('id').isMongoId()],
  validateRequest,
  adminController.deleteCustomer,
)

/** Bookings (all) */
router.get(
  '/bookings',
  [query('status').optional().isIn(['pending', 'confirmed', 'completed', 'cancelled'])],
  validateRequest,
  bookingController.listAllBookings,
)

router.get(
  '/bookings/:id',
  [param('id').isMongoId()],
  validateRequest,
  bookingController.getBookingById,
)

router.patch(
  '/bookings/:id',
  [
    param('id').isMongoId(),
    body('status').optional().isIn(['pending', 'confirmed', 'completed', 'cancelled']),
    body('serviceType').optional().trim(),
    body('preferredDate').optional().isISO8601().toDate(),
    body('notes').optional().trim(),
  ],
  validateRequest,
  bookingController.updateBooking,
)

router.delete(
  '/bookings/:id',
  [param('id').isMongoId()],
  validateRequest,
  bookingController.deleteBooking,
)

/** Quotes */
router.get(
  '/quotes',
  [query('status').optional().isIn(['pending', 'quoted', 'declined', 'accepted'])],
  validateRequest,
  quoteController.listAllQuotes,
)

router.get(
  '/quotes/:id',
  [param('id').isMongoId()],
  validateRequest,
  quoteController.getQuoteById,
)

router.patch(
  '/quotes/:id',
  [
    param('id').isMongoId(),
    body('status').optional().isIn(['pending', 'quoted', 'declined', 'accepted']),
    body('quotedAmount').optional().isFloat({ min: 0 }),
    body('adminNotes').optional().trim(),
  ],
  validateRequest,
  quoteController.updateQuote,
)

router.delete(
  '/quotes/:id',
  [param('id').isMongoId()],
  validateRequest,
  quoteController.deleteQuote,
)

/** Gallery (admin CRUD + list all) */
router.get('/gallery', galleryController.listAllGallery)

router.post(
  '/gallery',
  [
    body('title').trim().notEmpty(),
    body('imageUrl').trim().isURL({ require_tld: false }),
    body('caption').optional().trim(),
    body('sortOrder').optional().isInt(),
    body('published').optional().isBoolean(),
  ],
  validateRequest,
  galleryController.createGalleryItem,
)

router.patch(
  '/gallery/:id',
  [
    param('id').isMongoId(),
    body('title').optional().trim().notEmpty(),
    body('imageUrl').optional().trim().isURL({ require_tld: false }),
    body('caption').optional().trim(),
    body('sortOrder').optional().isInt(),
    body('published').optional().isBoolean(),
  ],
  validateRequest,
  galleryController.updateGalleryItem,
)

router.delete(
  '/gallery/:id',
  [param('id').isMongoId()],
  validateRequest,
  galleryController.deleteGalleryItem,
)

export default router
