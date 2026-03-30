import { User } from '../models/User.js'
import { sendError, sendSuccess } from '../utils/response.js'
import { asyncHandler } from '../utils/asyncHandler.js'

/**
 * Admin: paginated customer list (role = customer).
 */
export const listCustomers = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1)
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20))
  const skip = (page - 1) * limit
  const [customers, total] = await Promise.all([
    User.find({ role: 'customer' })
      .select('name email createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    User.countDocuments({ role: 'customer' }),
  ])
  return sendSuccess(res, {
    data: { customers },
    meta: { page, limit, total, pages: Math.ceil(total / limit) },
  })
})

export const getCustomerById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('name email role createdAt')
  if (!user || user.role !== 'customer') {
    return sendError(res, { message: 'Customer not found', statusCode: 404 })
  }
  return sendSuccess(res, { data: { customer: user } })
})

/**
 * Admin: update customer name/email (not password here — add dedicated flow if needed).
 */
export const updateCustomer = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user || user.role !== 'customer') {
    return sendError(res, { message: 'Customer not found', statusCode: 404 })
  }
  if (req.body.name) user.name = req.body.name
  if (req.body.email) user.email = req.body.email
  await user.save()
  return sendSuccess(res, { message: 'Customer updated', data: { customer: user } })
})

export const deleteCustomer = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user || user.role !== 'customer') {
    return sendError(res, { message: 'Customer not found', statusCode: 404 })
  }
  await User.findByIdAndDelete(req.params.id)
  return sendSuccess(res, { message: 'Customer deleted', data: { id: user._id } })
})
