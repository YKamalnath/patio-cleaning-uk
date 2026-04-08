import { Router } from 'express'
import { body } from 'express-validator'
import * as authController from '../controllers/auth.controller.js'
import { authenticate } from '../middleware/auth.js'
import { validateRequest } from '../middleware/validate.js'

const router = Router()

/**
 * POST /api/auth/register — new customer account.
 */
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('phone').optional().trim(),
  ],
  validateRequest,
  authController.register,
)

/**
 * POST /api/auth/login — JWT for portal (admin or customer).
 */
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  validateRequest,
  authController.login,
)

/**
 * GET /api/auth/me — current user (requires Bearer token).
 */
router.get('/me', authenticate, authController.me)

router.patch(
  '/profile',
  authenticate,
  [
    body('name').optional().trim().notEmpty(),
    body('email').optional().isEmail().normalizeEmail(),
    body('phone').optional().trim(),
    body().custom((_, { req }) => {
      const { name, email, phone } = req.body
      const hasUpdate = name != null || email != null || phone !== undefined
      if (!hasUpdate) {
        throw new Error('Provide at least one of name, email, or phone')
      }
      return true
    }),
  ],
  validateRequest,
  authController.updateProfile,
)

router.post(
  '/change-password',
  authenticate,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters'),
  ],
  validateRequest,
  authController.changePassword,
)

router.patch(
  '/preferences',
  authenticate,
  [body('notifyNewBookingEmails').isBoolean()],
  validateRequest,
  authController.updatePreferences,
)

export default router
