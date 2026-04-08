import { validationResult } from 'express-validator'
import { publicPathForFilename } from './uploadGallery.js'
import { unlinkGalleryFileIfOwned } from '../utils/galleryFile.js'
import { sendError } from '../utils/response.js'

/**
 * Same as validateRequest, but deletes an uploaded gallery file if validation fails
 * (Multer may have already written the file to disk).
 */
export function validateGalleryRequest(req, res, next) {
  const result = validationResult(req)
  if (!result.isEmpty()) {
    if (req.file?.filename) {
      void unlinkGalleryFileIfOwned(publicPathForFilename(req.file.filename))
    }
    const errors = result.array().map((e) => ({
      path: e.path,
      msg: e.msg,
      value: e.value,
    }))
    return sendError(res, {
      message: 'Validation failed',
      statusCode: 422,
      errors,
    })
  }
  next()
}
