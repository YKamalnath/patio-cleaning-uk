import mongoose from 'mongoose'

const gallerySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    /** Public URL path to the file, e.g. `/uploads/gallery/<filename>` (Multer disk storage). */
    imageUrl: { type: String, required: true, trim: true },
    caption: { type: String, trim: true },
    sortOrder: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
)

gallerySchema.index({ sortOrder: 1, createdAt: -1 })

export const Gallery = mongoose.model('Gallery', gallerySchema)
