import crypto from 'crypto'
import fs from 'fs'
import multer from 'multer'
import path from 'path'
import { GALLERY_UPLOAD_DIR, GALLERY_PUBLIC_PREFIX } from '../config/paths.js'

function ensureUploadDir() {
  fs.mkdirSync(GALLERY_UPLOAD_DIR, { recursive: true })
}

const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    ensureUploadDir()
    cb(null, GALLERY_UPLOAD_DIR)
  },
  filename(_req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg'
    const name = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${ext}`
    cb(null, name)
  },
})

const allowedExt = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp'])

export const uploadGalleryImage = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase()
    if (!allowedExt.has(ext)) {
      cb(new Error('Only JPEG, PNG, GIF, and WebP images are allowed'))
      return
    }
    cb(null, true)
  },
})

/** Build stored path (same value returned in API / saved in MongoDB `imageUrl`). */
export function publicPathForFilename(filename) {
  return `${GALLERY_PUBLIC_PREFIX}/${filename}`
}
