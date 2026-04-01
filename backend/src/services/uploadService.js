const { v4: uuidv4 } = require('uuid')
const { getContainerClient } = require('../config/azureBlob')

async function uploadBase64Image ({ fileName, mimeType, base64Data }) {
  const containerClient = await getContainerClient()
  const extension = fileName.includes('.') ? fileName.slice(fileName.lastIndexOf('.')) : ''
  const blobName = `${Date.now()}-${uuidv4()}${extension}`
  const blockBlobClient = containerClient.getBlockBlobClient(blobName)

  const buffer = Buffer.from(base64Data, 'base64')

  await blockBlobClient.uploadData(buffer, {
    blobHTTPHeaders: {
      blobContentType: mimeType
    }
  })

  return {
    url: blockBlobClient.url,
    blobName
  }
}

module.exports = {
  uploadBase64Image
}
