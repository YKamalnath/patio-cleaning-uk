import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** Absolute directory for gallery image files on disk */
export const GALLERY_UPLOAD_DIR = path.join(__dirname, '../../uploads/gallery')

/** Public URL path prefix (served by express.static) */
export const GALLERY_PUBLIC_PREFIX = '/uploads/gallery'
