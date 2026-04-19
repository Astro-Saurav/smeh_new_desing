const { asyncHandler } = require('../middleware/asyncHandler')
const { uploadFileBuffer } = require('../services/uploadService')

const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file was uploaded' });
  }

  // Multer handles the file buffer so we pass req.file to the service
  const result = await uploadFileBuffer(req.file)

  return res.status(201).json({
    url: result.url,
    blobName: result.blobName
  })
})

module.exports = {
  uploadImage
}