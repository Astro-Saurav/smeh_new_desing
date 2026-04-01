const { asyncHandler } = require('../middleware/asyncHandler')
const { uploadBase64Image } = require('../services/uploadService')

const uploadImage = asyncHandler(async (req, res) => {
  const result = await uploadBase64Image(req.validated.body)

  return res.status(201).json({
    url: result.url,
    blobName: result.blobName
  })
})

module.exports = {
  uploadImage
}
