const { v4: uuidv4 } = require('uuid')
const { getContainerClient } = require('../config/azureBlob')

/**
 * Uploads a file buffer directly to Azure Blob Storage
 * Handles MIME types dynamically and avoids Base64 encoding corruption.
 */
async function uploadFileBuffer (multerFile) {
  const containerClient = await getContainerClient()
  
  // Extract extension safely
  const originalName = multerFile.originalname || ''
  const extension = originalName.includes('.') ? originalName.slice(originalName.lastIndexOf('.')) : ''
  const blobName = `${Date.now()}-${uuidv4()}${extension}`
  
  const blockBlobClient = containerClient.getBlockBlobClient(blobName)

  // Upload the raw binary stream/buffer to prevent any encoding-based corruption
  await blockBlobClient.uploadData(multerFile.buffer, {
    blobHTTPHeaders: {
      blobContentType: multerFile.mimetype // Must match exactly so browsers render it instead of downloading
    }
  })

  // Optional: Add logging to help monitor success on production
  console.log(`[UploadService] Successfully uploaded: ${blobName} as ${multerFile.mimetype} (${multerFile.size} bytes)`)

  return {
    url: blockBlobClient.url,
    blobName
  }
}

module.exports = {
  uploadFileBuffer
}