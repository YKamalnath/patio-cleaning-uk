import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config/env.js'
import { sendError } from '../utils/response.js'

/**
 * Verifies Bearer JWT and attaches { id, role } to req.user.
 * Sample: Authorization: Bearer <token>
 */
export function authenticate(req, res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return sendError(res, { message: 'Authentication required', statusCode: 401 })
  }
  const token = header.slice(7)
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    req.user = {
      id: payload.sub,
      role: payload.role,
    }
    next()
  } catch {
    return sendError(res, { message: 'Invalid or expired token', statusCode: 401 })
  }
}
