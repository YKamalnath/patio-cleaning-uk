import jwt from 'jsonwebtoken'
import { JWT_EXPIRES_IN, JWT_SECRET } from '../config/env.js'
import { User } from '../models/User.js'
import { sendError, sendSuccess } from '../utils/response.js'
import { asyncHandler } from '../utils/asyncHandler.js'

function signToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN },
  )
}

function userResponse(user) {
  const base = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone ?? '',
    createdAt: user.createdAt,
  }
  if (user.role === 'admin') {
    base.notifyNewBookingEmails = user.notifyNewBookingEmails !== false
  }
  return base
}

/**
 * POST /api/auth/register — public; creates a customer account only.
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body
  const exists = await User.findOne({ email })
  if (exists) {
    return sendError(res, { message: 'Email already registered', statusCode: 409 })
  }
  const user = await User.create({
    name,
    email,
    password,
    role: 'customer',
    phone: typeof req.body.phone === 'string' ? req.body.phone.trim() : '',
  })
  const token = signToken(user)
  return sendSuccess(res, {
    message: 'Registration successful',
    statusCode: 201,
    data: { user: userResponse(user), token },
  })
})

/**
 * POST /api/auth/login — returns JWT for admin or customer.
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email }).select('+password')
  if (!user) {
    return sendError(res, { message: 'Invalid email or password', statusCode: 401 })
  }
  const ok = await user.comparePassword(password)
  if (!ok) {
    return sendError(res, { message: 'Invalid email or password', statusCode: 401 })
  }
  const token = signToken(user)
  const safe = await User.findById(user._id)
  return sendSuccess(res, {
    data: { user: userResponse(safe), token },
  })
})

/**
 * GET /api/auth/me — current user from JWT (optional helper for SPA).
 */
export const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
  if (!user) {
    return sendError(res, { message: 'User not found', statusCode: 404 })
  }
  return sendSuccess(res, { data: { user: userResponse(user) } })
})

/**
 * PATCH /api/auth/profile — update name, email, and/or phone (authenticated).
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, email, phone } = req.body
  const user = await User.findById(req.user.id)
  if (!user) {
    return sendError(res, { message: 'User not found', statusCode: 404 })
  }
  if (email !== undefined && email !== user.email) {
    const taken = await User.findOne({ email, _id: { $ne: user._id } })
    if (taken) {
      return sendError(res, { message: 'Email already in use', statusCode: 409 })
    }
    user.email = email
  }
  if (name !== undefined) {
    user.name = name
  }
  if (phone !== undefined) {
    user.phone = typeof phone === 'string' ? phone.trim() : ''
  }
  await user.save()
  const fresh = await User.findById(user._id)
  return sendSuccess(res, {
    message: 'Profile updated',
    data: { user: userResponse(fresh) },
  })
})

/**
 * POST /api/auth/change-password
 */
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body
  const user = await User.findById(req.user.id).select('+password')
  if (!user) {
    return sendError(res, { message: 'User not found', statusCode: 404 })
  }
  const ok = await user.comparePassword(currentPassword)
  if (!ok) {
    return sendError(res, { message: 'Current password is incorrect', statusCode: 400 })
  }
  user.password = newPassword
  await user.save()
  return sendSuccess(res, { message: 'Password updated' })
})

/**
 * PATCH /api/auth/preferences — admin only (notification toggles).
 */
export const updatePreferences = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    return sendError(res, { message: 'Forbidden', statusCode: 403 })
  }
  const { notifyNewBookingEmails } = req.body
  const user = await User.findById(req.user.id)
  if (!user) {
    return sendError(res, { message: 'User not found', statusCode: 404 })
  }
  user.notifyNewBookingEmails = Boolean(notifyNewBookingEmails)
  await user.save()
  const fresh = await User.findById(user._id)
  return sendSuccess(res, {
    message: 'Preferences saved',
    data: { user: userResponse(fresh) },
  })
})
