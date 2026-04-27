import { Booking } from '../models/Booking.js'
import { Invoice } from '../models/Invoice.js'
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

function makeInvoiceNumber(bookingId) {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `INV-${y}${m}${d}-${bookingId.toString().slice(-6).toUpperCase()}`
}

async function createInvoiceForBooking(booking, session) {
  const existing = await Invoice.findOne({ booking: booking._id })
  if (existing) return existing
  try {
    return await Invoice.create({
      invoiceNumber: makeInvoiceNumber(booking._id),
      booking: booking._id,
      ...(booking.customer ? { customer: booking.customer } : {}),
      amount: booking.amount,
      currency: booking.currency,
      stripeCheckoutSessionId: session?.id || booking.stripeCheckoutSessionId,
      stripePaymentIntentId:
        typeof session?.payment_intent === 'string' ? session.payment_intent : booking.stripePaymentIntentId,
      status: 'paid',
      issuedAt: new Date(),
      paidAt: new Date(),
    })
  } catch (error) {
    if (error?.code === 11000) {
      return Invoice.findOne({ booking: booking._id })
    }
    throw error
  }
}

async function markBookingPaidFromSession(session) {
  const bookingId = session?.metadata?.bookingId
  if (!bookingId) return null
  const booking = await Booking.findById(bookingId)
  if (!booking) return null

  if (booking.paymentStatus !== 'paid') {
    booking.status = 'confirmed'
    booking.paymentStatus = 'paid'
    booking.stripeCheckoutSessionId = session.id
    if (typeof session.payment_intent === 'string') {
      booking.stripePaymentIntentId = session.payment_intent
    }
    await booking.save()
  }

  const invoice = await createInvoiceForBooking(booking, session)
  return { booking, invoice }
}

/**
 * Customer: create a booking linked to authenticated user.
 */
export const createBooking = asyncHandler(async (req, res) => {
  const { serviceType, preferredDate, area, timeSlot, notes } = req.body
  const booking = await Booking.create({
    customer: req.user.id,
    serviceType,
    preferredDate,
    area,
    timeSlot,
    notes,
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

  const { serviceType, preferredDate, area, timeSlot, notes } = req.body
  const booking = await Booking.create({
    customer: req.user.id,
    serviceType,
    preferredDate,
    area,
    timeSlot,
    notes,
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
 * Public guest: create pending booking without an account and Stripe Checkout Session.
 */
export const createGuestBookingCheckoutSession = asyncHandler(async (req, res) => {
  requireStripe()
  const amount = BOOKING_PAYMENT_AMOUNT_GBP
  if (!Number.isFinite(amount) || amount <= 0) {
    return sendError(res, { message: 'Invalid booking payment amount configured', statusCode: 500 })
  }

  const { guestName, guestEmail, guestPhone, serviceType, preferredDate, area, timeSlot, notes } = req.body

  const booking = await Booking.create({
    guestName,
    guestEmail,
    guestPhone,
    serviceType,
    preferredDate,
    area,
    timeSlot,
    notes,
    status: 'pending',
    paymentStatus: 'unpaid',
    amount,
    currency: STRIPE_CURRENCY,
  })

  const clientUrl = getClientUrl(req)
  const unitAmount = Math.round(amount * 100)
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: guestEmail,
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
      guestBooking: 'true',
    },
    success_url: `${clientUrl}/book?payment=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${clientUrl}/book?payment=cancelled&booking_id=${booking._id.toString()}`,
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
 * Public guest: confirm payment after Stripe redirect (when webhook is delayed).
 */
export const confirmGuestBookingPayment = asyncHandler(async (req, res) => {
  requireStripe()
  const sessionId = String(req.query.session_id || '').trim()
  if (!sessionId) {
    return sendError(res, { message: 'Missing Stripe session id', statusCode: 400 })
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId)
  if (!session) {
    return sendError(res, { message: 'Stripe session not found', statusCode: 404 })
  }
  if (session.metadata?.guestBooking !== 'true') {
    return sendError(res, { message: 'Invalid guest checkout session', statusCode: 403 })
  }
  if (session.payment_status !== 'paid') {
    return sendError(res, { message: 'Payment not completed yet', statusCode: 409 })
  }

  const result = await markBookingPaidFromSession(session)
  if (!result) {
    return sendError(res, { message: 'Booking not found for session', statusCode: 404 })
  }

  return sendSuccess(res, {
    message: 'Payment confirmed and invoice generated',
    data: { booking: result.booking, invoice: result.invoice },
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
    await markBookingPaidFromSession(session)
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
 * Customer: fallback confirmation from success redirect (if webhook is delayed).
 */
export const confirmBookingPayment = asyncHandler(async (req, res) => {
  requireStripe()
  const sessionId = String(req.query.session_id || '').trim()
  if (!sessionId) {
    return sendError(res, { message: 'Missing Stripe session id', statusCode: 400 })
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId)
  if (!session) {
    return sendError(res, { message: 'Stripe session not found', statusCode: 404 })
  }
  if (session.metadata?.customerId !== req.user.id) {
    return sendError(res, { message: 'Unauthorized payment session', statusCode: 403 })
  }
  if (session.payment_status !== 'paid') {
    return sendError(res, { message: 'Payment not completed yet', statusCode: 409 })
  }

  const result = await markBookingPaidFromSession(session)
  if (!result) {
    return sendError(res, { message: 'Booking not found for session', statusCode: 404 })
  }

  return sendSuccess(res, {
    message: 'Payment confirmed and invoice generated',
    data: { booking: result.booking, invoice: result.invoice },
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
