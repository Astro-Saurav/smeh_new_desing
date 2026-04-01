const { BlobServiceClient } = require('@azure/storage-blob')
const { env } = require('./env')

let blobServiceClient

function getBlobServiceClient () {
  if (blobServiceClient) {
    return blobServiceClient
  }

  const connectionString = env.azureBlob.connectionString

  if (!connectionString) {
    throw new Error('Missing AZURE_STORAGE_CONNECTION_STRING')
  }

  blobServiceClient = BlobServiceClient.fromConnectionString(connectionString)
  return blobServiceClient
}

async function getContainerClient () {
  const serviceClient = getBlobServiceClient()
  const containerClient = serviceClient.getContainerClient(env.azureBlob.containerName)
  await containerClient.createIfNotExists({ access: 'blob' })
  return containerClient
}

module.exports = {
  getContainerClient
}
