const { asyncHandler } = require('../middleware/asyncHandler')
const { uploadMiddleware, saveUploadedFile } = require('../services/uploadService')
const R = require('../utils/response')

const upload = [
  uploadMiddleware.single('file'),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      return R.validationError(res, [{ field: 'file', message: 'No file uploaded or file type rejected' }])
    }

    const media = await saveUploadedFile(req.file)

    return R.created(res, {
      id: media.id,
      file_name: media.file_name,
      original_name: media.original_name,
      file_path: media.file_path,
      mime_type: media.mime_type,
      file_size: media.file_size,
      processing_status: media.processing_status
    }, 'File uploaded. Processing queued.')
  })
]

module.exports = { upload }
