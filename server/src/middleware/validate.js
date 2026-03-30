import { validationResult } from 'express-validator'
import { sendError } from '../utils/response.js'

/**
 * Runs after express-validator chains; returns 422 with field errors if invalid.
 */
export function validateRequest(req, res, next) {
  const result = validationResult(req)
  if (!result.isEmpty()) {
    const errors = result.array().map((e) => ({
      path: e.path,
      msg: e.msg,
      value: e.value,
    }))
    return sendError(res, {
      message: 'Validation failed',
      statusCode: 422,
      errors,
    })
  }
  next()
}
