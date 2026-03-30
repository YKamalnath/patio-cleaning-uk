import { Booking } from '../models/Booking.js'
import { sendError, sendSuccess } from '../utils/response.js'
import { asyncHandler } from '../utils/asyncHandler.js'

/**
 * Customer: create a booking linked to authenticated user.
 */
export const createBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.create({
    customer: req.user.id,
    ...req.body,
  })
  return sendSuccess(res, {
    message: 'Booking created',
    statusCode: 201,
    data: { booking },
  })
})

/**
 * Customer: list own bookings.
 */
export const listMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ customer: req.user.id }).sort({ preferredDate: -1 })
  return sendSuccess(res, { data: { bookings } })
})

/**
 * Admin: list all bookings with optional status filter.
 */
export const listAllBookings = asyncHandler(async (req, res) => {
  const { status } = req.query
  const filter = {}
  if (status) filter.status = status
  const bookings = await Booking.find(filter)
    .populate('customer', 'name email')
    .sort({ createdAt: -1 })
  return sendSuccess(res, { data: { bookings } })
})

/**
 * Admin: get one booking.
 */
export const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate('customer', 'name email phone')
  if (!booking) {
    return sendError(res, { message: 'Booking not found', statusCode: 404 })
  }
  return sendSuccess(res, { data: { booking } })
})

/**
 * Admin: update booking (status, notes, etc.).
 */
export const updateBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
  if (!booking) {
    return sendError(res, { message: 'Booking not found', statusCode: 404 })
  }
  return sendSuccess(res, { message: 'Booking updated', data: { booking } })
})

/**
 * Admin: delete booking.
 */
export const deleteBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findByIdAndDelete(req.params.id)
  if (!booking) {
    return sendError(res, { message: 'Booking not found', statusCode: 404 })
  }
  return sendSuccess(res, { message: 'Booking deleted', data: { id: booking._id } })
})
