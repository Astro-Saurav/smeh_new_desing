const { BlobServiceClient } = require('@azure/storage-blob');
try {
  BlobServiceClient.fromConnectionString('random garbage string');
} catch(e) {
  console.log("Error 1 generated:", e.message);
}

try {
  BlobServiceClient.fromConnectionString('TfGqkYk9Zz1....=='); // just a key
} catch(e) {
  console.log("Error 2 generated:", e.message);
}
