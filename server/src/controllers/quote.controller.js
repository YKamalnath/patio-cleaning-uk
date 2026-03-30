import { Quote } from '../models/Quote.js'
import { sendError, sendSuccess } from '../utils/response.js'
import { asyncHandler } from '../utils/asyncHandler.js'

/**
 * Customer: request a quote.
 */
export const createQuote = asyncHandler(async (req, res) => {
  const quote = await Quote.create({
    customer: req.user.id,
    contactName: req.body.contactName,
    email: req.body.email,
    phone: req.body.phone,
    postcode: req.body.postcode,
    serviceSummary: req.body.serviceSummary,
    message: req.body.message,
  })
  return sendSuccess(res, {
    message: 'Quote request submitted',
    statusCode: 201,
    data: { quote },
  })
})

/**
 * Customer: list own quote requests.
 */
export const listMyQuotes = asyncHandler(async (req, res) => {
  const filter = { customer: req.user.id }
  if (req.query.status) filter.status = req.query.status
  const quotes = await Quote.find(filter).sort({ createdAt: -1 })
  return sendSuccess(res, { data: { quotes } })
})

/**
 * Admin: list all quotes.
 */
export const listAllQuotes = asyncHandler(async (req, res) => {
  const { status } = req.query
  const filter = {}
  if (status) filter.status = status
  const quotes = await Quote.find(filter)
    .populate('customer', 'name email')
    .sort({ createdAt: -1 })
  return sendSuccess(res, { data: { quotes } })
})

/**
 * Admin: get quote by id.
 */
export const getQuoteById = asyncHandler(async (req, res) => {
  const quote = await Quote.findById(req.params.id).populate('customer', 'name email')
  if (!quote) {
    return sendError(res, { message: 'Quote not found', statusCode: 404 })
  }
  return sendSuccess(res, { data: { quote } })
})

/**
 * Admin: update quote (status, amount, admin notes).
 */
export const updateQuote = asyncHandler(async (req, res) => {
  const quote = await Quote.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
  if (!quote) {
    return sendError(res, { message: 'Quote not found', statusCode: 404 })
  }
  return sendSuccess(res, { message: 'Quote updated', data: { quote } })
})

/**
 * Admin: delete quote.
 */
export const deleteQuote = asyncHandler(async (req, res) => {
  const quote = await Quote.findByIdAndDelete(req.params.id)
  if (!quote) {
    return sendError(res, { message: 'Quote not found', statusCode: 404 })
  }
  return sendSuccess(res, { message: 'Quote deleted', data: { id: quote._id } })
})
