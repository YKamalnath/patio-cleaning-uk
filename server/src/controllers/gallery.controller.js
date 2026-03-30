import { Gallery } from '../models/Gallery.js'
import { sendError, sendSuccess } from '../utils/response.js'
import { asyncHandler } from '../utils/asyncHandler.js'

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

export const createGalleryItem = asyncHandler(async (req, res) => {
  const item = await Gallery.create({
    ...req.body,
    createdBy: req.user.id,
  })
  return sendSuccess(res, {
    message: 'Gallery item created',
    statusCode: 201,
    data: { item },
  })
})

export const updateGalleryItem = asyncHandler(async (req, res) => {
  const item = await Gallery.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
  if (!item) {
    return sendError(res, { message: 'Gallery item not found', statusCode: 404 })
  }
  return sendSuccess(res, { message: 'Gallery item updated', data: { item } })
})

export const deleteGalleryItem = asyncHandler(async (req, res) => {
  const item = await Gallery.findByIdAndDelete(req.params.id)
  if (!item) {
    return sendError(res, { message: 'Gallery item not found', statusCode: 404 })
  }
  return sendSuccess(res, { message: 'Gallery item deleted', data: { id: item._id } })
})
