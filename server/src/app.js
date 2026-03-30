import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import apiRoutes from './routes/index.js'
import { errorHandler } from './middleware/errorHandler.js'
import { NODE_ENV } from './config/env.js'

/**
 * Express application factory — easy to reuse in tests.
 */
export function createApp() {
  const app = express()

  app.use(helmet())
  app.use(
    cors({
      origin: NODE_ENV === 'development' ? true : process.env.CORS_ORIGIN || true,
      credentials: true,
    }),
  )
  app.use(express.json({ limit: '1mb' }))

  /** Health check for load balancers / uptime */
  app.get('/health', (_req, res) => {
    res.status(200).json({ ok: true, service: 'patio-cleaning-api' })
  })

  /**
   * API v1 — all business routes under /api
   * Sample: POST /api/auth/login, GET /api/admin/dashboard/stats
   */
  app.use('/api', apiRoutes)

  app.use((_req, res) => {
    res.status(404).json({ success: false, message: 'Not found' })
  })

  app.use(errorHandler)

  return app
}
