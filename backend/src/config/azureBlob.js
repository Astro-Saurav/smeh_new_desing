const { BlobServiceClient } = require('@azure/storage-blob')
const { env } = require('./env')

const blobServiceClient = BlobServiceClient.fromConnectionString(env.azureBlob.connectionString)

async function getContainerClient () {
  const containerClient = blobServiceClient.getContainerClient(env.azureBlob.containerName)
  await containerClient.createIfNotExists({ access: 'blob' })
  return containerClient
}

module.exports = {
  getContainerClient
}
