/**
 * One-time: create first admin user (requires MONGO_URI and JWT_SECRET in .env).
 * Usage: npm run seed:admin
 */
import mongoose from 'mongoose'
import { connectDB } from '../src/config/db.js'
import { User } from '../src/models/User.js'

const email = process.env.ADMIN_EMAIL || 'admin@example.com'
const password = process.env.ADMIN_PASSWORD || 'ChangeMeAdmin123!'
const name = process.env.ADMIN_NAME || 'Administrator'

async function main() {
  await connectDB()

  const existing = await User.findOne({ email })
  if (existing) {
    console.log('[seed-admin] Admin already exists:', email)
    return
  }

  await User.create({ name, email, password, role: 'admin' })
  console.log('[seed-admin] Created admin:', email)
}

main()
  .catch((err) => {
    console.error('[seed-admin]', err.message)
    process.exit(1)
  })
  .finally(async () => {
    await mongoose.connection.close()
  })
