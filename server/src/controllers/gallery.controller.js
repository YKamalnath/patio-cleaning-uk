import { Gallery } from '../models/Gallery.js'
import { publicPathForFilename } from '../middleware/uploadGallery.js'
import { sendError, sendSuccess } from '../utils/response.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { unlinkGalleryFileIfOwned } from '../utils/galleryFile.js'

function parseBool(v) {
  if (v === undefined || v === null || v === '') return undefined
  if (typeof v === 'boolean') return v
  if (v === 'true' || v === '1') return true
  if (v === 'false' || v === '0') return false
  return undefined
}

function parseSortOrder(v) {
  if (v === undefined || v === null || v === '') return undefined
  const n = Number(v)
  return Number.isFinite(n) ? n : undefined
}

/** Public-style list (published only) — can be used by marketing site without auth if exposed. */
export const listPublishedGallery = asyncHandler(async (req, res) => {
  const items = await Gallery.find({ published: true }).sort({ sortOrder: 1, createdAt: -1 })
  return sendSuccess(res, { data: { items } })
})

/** Admin: full list including drafts. */
export const listAllGallery = asyncHandler(async (req, res) => {
  const items = await Gallery.find().sort({ sortOrder: 1, createdAt: -1 })
  return sendSuccess(res, { data: { items } })
})

/** Admin: create with multipart file — only the public path is stored in MongoDB (`imageUrl`). */
export const createGalleryItem = asyncHandler(async (req, res) => {
  if (!req.file) {
    return sendError(res, { message: 'Image file is required', statusCode: 400 })
  }
  const title = typeof req.body.title === 'string' ? req.body.title.trim() : ''
  if (!title) {
    await unlinkGalleryFileIfOwned(publicPathForFilename(req.file.filename))
    return sendError(res, { message: 'Title is required', statusCode: 400 })
  }

  const caption = typeof req.body.caption === 'string' ? req.body.caption.trim() : ''
  const sortOrder = parseSortOrder(req.body.sortOrder)
  const published = parseBool(req.body.published)

  const item = await Gallery.create({
    title,
    imageUrl: publicPathForFilename(req.file.filename),
    caption: caption || undefined,
    sortOrder: sortOrder ?? 0,
    published: published !== undefined ? published : true,
    createdBy: req.user.id,
  })
  return sendSuccess(res, {
    message: 'Gallery item created',
    statusCode: 201,
    data: { item },
  })
})

/**
 * Admin: update metadata; optional new image replaces file on disk and updates `imageUrl`.
 * Does not accept arbitrary `imageUrl` in body — only Multer uploads.
 */
export const updateGalleryItem = asyncHandler(async (req, res) => {
  const existing = await Gallery.findById(req.params.id)
  if (!existing) {
    if (req.file) {
      await unlinkGalleryFileIfOwned(publicPathForFilename(req.file.filename))
    }
    return sendError(res, { message: 'Gallery item not found', statusCode: 404 })
  }

  const updates = {}

  if (req.body.title !== undefined) {
    const title = typeof req.body.title === 'string' ? req.body.title.trim() : ''
    if (!title) {
      if (req.file) await unlinkGalleryFileIfOwned(publicPathForFilename(req.file.filename))
      return sendError(res, { message: 'Title cannot be empty', statusCode: 400 })
    }
    updates.title = title
  }

  if (req.body.caption !== undefined) {
    updates.caption = typeof req.body.caption === 'string' ? req.body.caption.trim() : ''
  }

  const sortOrder = parseSortOrder(req.body.sortOrder)
  if (sortOrder !== undefined) updates.sortOrder = sortOrder

  const published = parseBool(req.body.published)
  if (published !== undefined) updates.published = published

  if (req.file) {
    const newUrl = publicPathForFilename(req.file.filename)
    const previousUrl = existing.imageUrl
    updates.imageUrl = newUrl
    await unlinkGalleryFileIfOwned(previousUrl)
  }

  const item = await Gallery.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  })

  return sendSuccess(res, { message: 'Gallery item updated', data: { item } })
})

export const deleteGalleryItem = asyncHandler(async (req, res) => {
  const item = await Gallery.findByIdAndDelete(req.params.id)
  if (!item) {
    return sendError(res, { message: 'Gallery item not found', statusCode: 404 })
  }
  await unlinkGalleryFileIfOwned(item.imageUrl)
  return sendSuccess(res, { message: 'Gallery item deleted', data: { id: item._id } })
})
