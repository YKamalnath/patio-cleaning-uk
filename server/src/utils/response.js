/**
 * Centralised API response shape for consistency across clients.
 * { success, message, data?, errors?, meta? }
 */

export function sendSuccess(res, { data = null, message = 'OK', statusCode = 200, meta = null }) {
  const body = { success: true, message, data }
  if (meta != null) body.meta = meta
  return res.status(statusCode).json(body)
}

export function sendError(res, { message = 'Something went wrong', statusCode = 400, errors = null }) {
  const body = { success: false, message }
  if (errors != null) body.errors = errors
  return res.status(statusCode).json(body)
}
