#!/usr/bin/env node
const major = Number.parseInt(process.version.slice(1).split('.')[0], 10)
if (Number.isNaN(major) || major < 18) {
  console.error(
    `[check-node] Node ${process.version} is not supported. Use Node 18 or newer (20 recommended).\n` +
      '  If you use nvm: nvm install 20 && nvm use',
  )
  process.exit(1)
}
