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
      console.log('[db] MongoDB Atlas connected')
    }
  } catch (err) {
    console.error('[db] Connection failed:', err.message)
    process.exit(1)
  }
}

/** Graceful shutdown helper for tests or process managers */
export async function disconnectDB() {
  await mongoose.connection.close()
}
