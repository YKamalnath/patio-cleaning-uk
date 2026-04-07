import { Router } from 'express'
import * as bookingController from '../controllers/booking.controller.js'
import * as galleryController from '../controllers/gallery.controller.js'
const router = Router()

/**
 * Public published gallery for marketing site (no auth).
 * GET /api/public/gallery
 */
router.get('/gallery', galleryController.listPublishedGallery)
router.post('/stripe/webhook', bookingController.stripeWebhook)

export default router
