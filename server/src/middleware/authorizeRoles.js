import { sendError } from '../utils/response.js'

/**
 * Role-based access after authenticate().
 * @param {...string} roles — allowed roles (e.g. 'admin', 'customer')
 */
export function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, { message: 'Authentication required', statusCode: 401 })
    }
    if (!roles.includes(req.user.role)) {
      return sendError(res, { message: 'Forbidden: insufficient permissions', statusCode: 403 })
    }
    next()
  }
}
