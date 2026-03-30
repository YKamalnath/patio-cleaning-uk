import { createApp } from './app.js'
import { connectDB } from './config/db.js'
import { PORT } from './config/env.js'

async function start() {
  await connectDB()
  const app = createApp()
  app.listen(PORT, () => {
    console.log(`[server] API listening on http://localhost:${PORT}`)
    console.log(`[server] Health: http://localhost:${PORT}/health`)
    console.log(`[server] API base: http://localhost:${PORT}/api`)
  })
}

start()
