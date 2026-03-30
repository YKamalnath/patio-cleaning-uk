import mongoose from 'mongoose'
import { NODE_ENV } from '../config/env.js'
import { sendError } from '../utils/response.js'

/**
 * Global error handler — maps known errors to safe client responses.
 */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (NODE_ENV === 'development') {
    console.error('[error]', err)
  }

  if (err instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(err.errors).map((e) => e.message)
    return sendError(res, { message: 'Validation failed', statusCode: 400, errors })
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'field'
    return sendError(res, {
      message: `${field} already exists`,
      statusCode: 409,
    })
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return sendError(res, { message: 'Invalid or expired token', statusCode: 401 })
  }

  const statusCode = err.statusCode || err.status || 500
  const message =
    statusCode === 500 && NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message || 'Internal server error'

  return sendError(res, { message, statusCode })
}
