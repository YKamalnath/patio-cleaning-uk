/**
 * Reusable MongoDB (Atlas) connection via Mongoose.
 * Handles errors and avoids duplicate listeners in dev (nodemon reloads).
 */
import mongoose from 'mongoose'
import { DEV_ALLOW_DB_FAILURE, MONGO_URI, NODE_ENV } from './env.js'

mongoose.set('strictQuery', true)

export async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10_000,
    })
    if (NODE_ENV === 'development') {
      console.log('[db] MongoDB connected')
    }
  } catch (err) {
    console.error('[db] Connection failed:', err.message)
    if (/ENOTFOUND|querySrv/i.test(String(err.message))) {
      console.error(
        '[db] Hint: Check MONGO_URI — use your real Atlas hostname (from Atlas → Connect), not the example placeholder. ' +
          'For local dev: run `docker compose up -d mongo` and set MONGO_URI=mongodb://127.0.0.1:27017/patio-cleaning',
      )
    }
    if (DEV_ALLOW_DB_FAILURE) {
      console.warn(
        '[db] Continuing without database (DEV_ALLOW_DB_FAILURE=true). Start Mongo or fix MONGO_URI for full API behaviour.',
      )
      return
    }
    process.exit(1)
  }
}

export function isDbConnected() {
  return mongoose.connection.readyState === 1
}

/** Graceful shutdown helper for tests or process managers */
export async function disconnectDB() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close()
  }
}
