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
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  }
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
