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
import { validateGalleryRequest } from '../middleware/validateGalleryRequest.js'
import { uploadGalleryImage } from '../middleware/uploadGallery.js'

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

/** Gallery (admin CRUD + list all) — images via Multer; DB stores public path only */
router.get('/gallery', galleryController.listAllGallery)

const galleryPublishedField = body('published')
  .optional()
  .custom((value) => {
    if (value === true || value === false) return true
    if (value === 'true' || value === 'false' || value === '1' || value === '0' || value === '') return true
    throw new Error('Invalid published flag')
  })

router.post(
  '/gallery',
  uploadGalleryImage.single('image'),
  [
    body('title').trim().notEmpty(),
    body('caption').optional().trim(),
    body('sortOrder').optional({ values: 'falsy' }).isInt(),
    galleryPublishedField,
  ],
  validateGalleryRequest,
  galleryController.createGalleryItem,
)

router.patch(
  '/gallery/:id',
  uploadGalleryImage.single('image'),
  [
    param('id').isMongoId(),
    body('title').optional().trim().notEmpty(),
    body('caption').optional().trim(),
    body('sortOrder').optional({ values: 'falsy' }).isInt(),
    galleryPublishedField,
  ],
  validateGalleryRequest,
  galleryController.updateGalleryItem,
)

router.delete(
  '/gallery/:id',
  [param('id').isMongoId()],
  validateRequest,
  galleryController.deleteGalleryItem,
)

export default router
