import { Booking } from '../models/Booking.js'
import Stripe from 'stripe'
import {
  BOOKING_PAYMENT_AMOUNT_GBP,
  CLIENT_APP_URL,
  STRIPE_CURRENCY,
  STRIPE_PUBLISHABLE_KEY,
  STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET,
} from '../config/env.js'
import { sendError, sendSuccess } from '../utils/response.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY) : null

function requireStripe() {
  if (!stripe) {
    const error = new Error('Stripe is not configured on the server')
    error.statusCode = 500
    throw error
  }
  if (!STRIPE_WEBHOOK_SECRET) {
    const error = new Error('Stripe webhook secret is missing')
    error.statusCode = 500
    throw error
  }
}

function getClientUrl(req) {
  if (CLIENT_APP_URL) return CLIENT_APP_URL
  if (req.headers.origin) return req.headers.origin
  return 'http://localhost:5173'
}

/**
 * Customer: create a booking linked to authenticated user.
 */
export const createBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.create({
    customer: req.user.id,
    ...req.body,
    status: 'pending',
    paymentStatus: 'unpaid',
    amount: BOOKING_PAYMENT_AMOUNT_GBP,
    currency: STRIPE_CURRENCY,
  })
  return sendSuccess(res, {
    message: 'Booking created',
    statusCode: 201,
    data: { booking },
  })
})

/**
 * Customer: create pending booking and Stripe Checkout Session.
 */
export const createBookingCheckoutSession = asyncHandler(async (req, res) => {
  requireStripe()
  const amount = BOOKING_PAYMENT_AMOUNT_GBP
  if (!Number.isFinite(amount) || amount <= 0) {
    return sendError(res, { message: 'Invalid booking payment amount configured', statusCode: 500 })
  }

  const booking = await Booking.create({
    customer: req.user.id,
    ...req.body,
    status: 'pending',
    paymentStatus: 'unpaid',
    amount,
    currency: STRIPE_CURRENCY,
  })

  const clientUrl = getClientUrl(req)
  const unitAmount = Math.round(amount * 100)
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: STRIPE_CURRENCY,
          unit_amount: unitAmount,
          product_data: {
            name: `Patio cleaning booking (${booking.serviceType})`,
            description: `Booking reference ${booking._id.toString().slice(-6).toUpperCase()}`,
          },
        },
      },
    ],
    metadata: {
      bookingId: booking._id.toString(),
      customerId: req.user.id,
    },
    success_url: `${clientUrl}/customer/bookings?payment=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${clientUrl}/customer/bookings?payment=cancelled&booking_id=${booking._id.toString()}`,
  })

  booking.stripeCheckoutSessionId = session.id
  await booking.save()

  return sendSuccess(res, {
    message: 'Checkout session created',
    statusCode: 201,
    data: {
      booking,
      checkoutSessionId: session.id,
      checkoutUrl: session.url,
      stripePublishableKey: STRIPE_PUBLISHABLE_KEY || null,
    },
  })
})

/**
 * Public: Stripe webhook to transition payment status.
 */
export const stripeWebhook = asyncHandler(async (req, res) => {
  requireStripe()
  const signature = req.headers['stripe-signature']
  if (!signature) {
    return sendError(res, { message: 'Missing Stripe signature', statusCode: 400 })
  }

  let event
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, STRIPE_WEBHOOK_SECRET)
  } catch (error) {
    return sendError(res, { message: `Webhook signature verification failed: ${error.message}`, statusCode: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const bookingId = session?.metadata?.bookingId
    if (bookingId) {
      await Booking.findByIdAndUpdate(bookingId, {
        status: 'confirmed',
        paymentStatus: 'paid',
        stripeCheckoutSessionId: session.id,
        stripePaymentIntentId: typeof session.payment_intent === 'string' ? session.payment_intent : undefined,
      })
    }
  }

  if (event.type === 'checkout.session.expired') {
    const session = event.data.object
    const bookingId = session?.metadata?.bookingId
    if (bookingId) {
      await Booking.findByIdAndUpdate(bookingId, {
        status: 'pending',
        paymentStatus: 'failed',
      })
    }
  }

  return res.status(200).json({ received: true })
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
