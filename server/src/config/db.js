/**
 * Reusable MongoDB (Atlas) connection via Mongoose.
 * Handles errors and avoids duplicate listeners in dev (nodemon reloads).
 */
import mongoose from 'mongoose'
import { MONGO_URI, NODE_ENV } from './env.js'

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
    process.exit(1)
  }
}

/** Graceful shutdown helper for tests or process managers */
export async function disconnectDB() {
  await mongoose.connection.close()
}
