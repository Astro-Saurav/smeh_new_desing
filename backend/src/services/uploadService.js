const path = require('path')
const fs = require('fs')
const multer = require('multer')
const crypto = require('crypto')
const { prisma } = require('../config/db')
const { enqueueImageProcessing } = require('../queue')
const { env } = require('../config/env')
const logger = require('../utils/logger')

const UPLOAD_ROOT = path.resolve(env.uploadBasePath)
const MAX_SIZE = env.maxUploadSizeBytes

// Allowed MIME types and extensions
const ALLOWED_MIMES = new Set([
  'image/jpeg', 'image/jpg', 'image/png', 'image/gif',
  'image/webp', 'image/avif', 'image/svg+xml',
  'application/pdf', 'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', // pptx
  'text/plain', 'text/csv'
])

const ALLOWED_EXTENSIONS = new Set([
  '.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.svg',
  '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.csv'
])

// Blocked dangerous extensions
const BLOCKED_EXTENSIONS = new Set([
  '.exe', '.bat', '.cmd', '.sh', '.php', '.py', '.js', '.rb',
  '.html', '.htm', '.xml', '.asp', '.aspx', '.jsp', '.cgi'
])

// Magic number signatures for common image formats
const MAGIC_NUMBERS = [
  { bytes: [0xFF, 0xD8, 0xFF], type: 'jpeg' }, // JPEG
  { bytes: [0x89, 0x50, 0x4E, 0x47], type: 'png' }, // PNG
  { bytes: [0x47, 0x49, 0x46, 0x38], type: 'gif' }, // GIF
  { bytes: [0x52, 0x49, 0x46, 0x46], type: 'webp' }, // RIFF (WebP)
  { bytes: [0x00, 0x00, 0x00], type: 'avif' } // AVIF (fragile — supplement with MIME)
]

/**
 * Detect file type from magic bytes
 * @param {Buffer} buffer - first 12 bytes
 */
function detectMagicNumber (buffer) {
  for (const sig of MAGIC_NUMBERS) {
    const match = sig.bytes.every((b, i) => buffer[i] === b)
    if (match) return sig.type
  }
  return null
}

/**
 * Validate upload file synchronously (used in multer fileFilter)
 */
function validateUploadFile (req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase()

  if (BLOCKED_EXTENSIONS.has(ext)) {
    return cb(new Error(`Blocked file type: ${ext}`), false)
  }

  if (!ALLOWED_MIMES.has(file.mimetype)) {
    return cb(new Error(`Invalid MIME type: ${file.mimetype}`), false)
  }

  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return cb(new Error(`Invalid extension: ${ext}`), false)
  }

  cb(null, true)
}

/**
 * Create multer storage engine
 * Files are dynamically routed to 'news' or 'documents' based on MIME type.
 */
function createMulterStorage () {
  return multer.diskStorage({
    destination: (_req, file, cb) => {
      const isImage = file.mimetype.startsWith('image/')
      const subfolder = isImage ? 'news' : 'documents'
      const dest = path.join(UPLOAD_ROOT, subfolder)

      if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true })
      cb(null, dest)
    },
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase()
      const name = `${crypto.randomUUID()}${ext}`
      cb(null, name)
    }
  })
}

const uploadMiddleware = multer({
  storage: createMulterStorage(),
  limits: { fileSize: MAX_SIZE },
  fileFilter: validateUploadFile
})

/**
 * Save uploaded file to media table and enqueue image processing
 * @param {Express.Multer.File} file
 * @returns {Promise<import('@prisma/client').Media>}
 */
async function saveUploadedFile (file) {
  // Read first 12 bytes for magic number check
  const fd = fs.openSync(file.path, 'r')
  const header = Buffer.alloc(12)
  fs.readSync(fd, header, 0, 12, 0)
  fs.closeSync(fd)

  const detectedType = detectMagicNumber(header)

  // For non-JPEG/PNG/GIF, we allow if MIME matches (AVIF, SVG, WebP)
  const relPath = path.relative(UPLOAD_ROOT, file.path).replace(/\\/g, '/')

  const media = await prisma.media.create({
    data: {
      file_name: path.basename(file.path),
      original_name: file.originalname,
      file_path: relPath,
      mime_type: file.mimetype,
      file_signature: detectedType,
      file_size: file.size,
      processing_status: file.mimetype.startsWith('image/') ? 'pending' : 'done' // Mark done if not an image
    }
  })

  // Enqueue async processing (Sharp will handle the actual image optimization)
  if (file.mimetype.startsWith('image/')) {
    await enqueueImageProcessing(media.id, relPath)
  }

  logger.info('File upload saved', { mediaId: media.id, originalName: file.originalname })
  return media
}

/**
 * Delete a media record and its associated physical files from disk
 * @param {string} mediaId - UUID of the Media record
 * @returns {Promise<boolean>} - True if deleted, false if not found
 */
async function deleteMediaFiles (mediaId) {
  const media = await prisma.media.findUnique({ where: { id: mediaId } })
  if (!media) return false

  // List of possible file paths relative to UPLOAD_ROOT
  const paths = [
    media.file_path,
    media.path_webp,
    media.path_avif,
    media.path_thumb,
    media.path_medium,
    media.path_large
  ].filter(Boolean)

  for (const relPath of paths) {
    const absPath = path.join(UPLOAD_ROOT, relPath)
    if (fs.existsSync(absPath)) {
      try {
        fs.unlinkSync(absPath)
        logger.info(`Deleted file: ${absPath}`)
      } catch (err) {
        logger.error(`Failed to delete file ${absPath}: ${err.message}`)
      }
    }
  }

  // Delete DB record
  await prisma.media.delete({ where: { id: mediaId } })
  logger.info(`Media record ${mediaId} deleted`)
  return true
}

module.exports = {
  uploadMiddleware,
  saveUploadedFile,
  validateUploadFile,
  deleteMediaFiles
}
