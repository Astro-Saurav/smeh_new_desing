const { v4: uuidv4 } = require('uuid')
const { getContainerClient } = require('../config/azureBlob')

/**
 * Uploads a base64-encoded image to Azure Blob Storage.
 * IMPORTANT: base64Data must be PURE base64 (no data URI prefix like "data:image/jpeg;base64,")
 * The frontend is responsible for stripping the prefix before sending.
 */
async function uploadBase64Image ({ fileName, mimeType, base64Data }) {
  if (!base64Data || !fileName || !mimeType) {
    throw new Error('Missing required upload fields: fileName, mimeType, base64Data')
  }

  // Safety net: strip data URI prefix if frontend accidentally sends it
  const cleanBase64 = base64Data.includes(',') ? base64Data.split(',')[1] : base64Data

  const containerClient = await getContainerClient()
  const extension = fileName.includes('.') ? fileName.slice(fileName.lastIndexOf('.')) : ''
  const blobName = `${Date.now()}-${uuidv4()}${extension}`
  const blockBlobClient = containerClient.getBlockBlobClient(blobName)

  // Convert pure base64 to binary buffer — no corruption
  const buffer = Buffer.from(cleanBase64, 'base64')

  console.log(`[Upload] Uploading ${blobName} | type=${mimeType} | size=${buffer.length} bytes`)

  await blockBlobClient.uploadData(buffer, {
    blobHTTPHeaders: { blobContentType: mimeType }
  })

  console.log(`[Upload] Success: ${blockBlobClient.url}`)

  return {
    url: blockBlobClient.url,
    blobName
  }
}

module.exports = { uploadBase64Image }