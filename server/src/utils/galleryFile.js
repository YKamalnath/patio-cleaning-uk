import fs from 'fs/promises'
import path from 'path'
import { GALLERY_PUBLIC_PREFIX, GALLERY_UPLOAD_DIR } from '../config/paths.js'

/**
 * Remove uploaded file if `imageUrl` points at our gallery store.
 * Safe no-op for external URLs or missing files.
 */
export async function unlinkGalleryFileIfOwned(imageUrl) {
  if (!imageUrl || typeof imageUrl !== 'string') return
  if (!imageUrl.startsWith(`${GALLERY_PUBLIC_PREFIX}/`)) return
  const filename = path.basename(imageUrl)
  if (!filename || filename === '.' || filename === '..') return
  const resolvedDir = path.resolve(GALLERY_UPLOAD_DIR)
  const abs = path.resolve(resolvedDir, filename)
  const prefix = resolvedDir.endsWith(path.sep) ? resolvedDir : `${resolvedDir}${path.sep}`
  if (!abs.startsWith(prefix)) return
  try {
    await fs.unlink(abs)
  } catch (e) {
    if (e.code !== 'ENOENT') throw e
  }
}
