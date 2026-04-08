import { createApp } from './app.js'
import { connectDB } from './config/db.js'
import { PORT } from './config/env.js'

async function start() {
  await connectDB()
  const app = createApp()
  const server = app.listen(PORT, () => {
    console.log(`[server] API listening on http://localhost:${PORT}`)
    console.log(`[server] Health: http://localhost:${PORT}/health`)
    console.log(`[server] API base: http://localhost:${PORT}/api`)
  })
  server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
      console.error(`[server] Port ${PORT} is already in use. Stop the other process or set PORT=5001 in .env`)
    } else {
      console.error('[server]', err)
    }
    process.exit(1)
  })
}

start()
