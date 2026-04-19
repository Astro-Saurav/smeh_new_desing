const { asyncHandler } = require('../middleware/asyncHandler')
const { uploadBase64Image } = require('../services/uploadService')

const uploadImage = asyncHandler(async (req, res) => {
  const { base64Data, fileName, mimeType } = req.body

  if (!base64Data || !fileName || !mimeType) {
    return res.status(400).json({ error: 'Missing fields: base64Data, fileName, mimeType are all required' })
  }

  const result = await uploadBase64Image({ base64Data, fileName, mimeType })

  return res.status(201).json({
    url: result.url,
    blobName: result.blobName
  })
})

module.exports = { uploadImage }