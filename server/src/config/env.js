/**
 * Centralised environment configuration.
 * Fails fast when required variables are missing (production safety).
 */
import dotenv from 'dotenv'

dotenv.config()

const required = ['MONGO_URI', 'JWT_SECRET']

function validateEnv() {
  const missing = required.filter((key) => !process.env[key]?.trim())
  if (missing.length > 0) {
    console.error(
      `[config] Missing required environment variables: ${missing.join(', ')}`,
    )
    console.error('Copy .env.example to .env and set values.')
    process.exit(1)
  }
}

validateEnv()

export const PORT = Number(process.env.PORT) || 5000
export const MONGO_URI = process.env.MONGO_URI
export const JWT_SECRET = process.env.JWT_SECRET
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'
export const NODE_ENV = process.env.NODE_ENV || 'development'
