const { DefaultAzureCredential } = require('@azure/identity');
const { BlobServiceClient } = require('@azure/storage-blob');

module.exports = async function (context, req) {
  try {
    // Hardcodeamos la URL del Storage Account
    const accountUrl = 'https://sa010101.blob.core.windows.net';
    context.log('Conectándose a Storage Account en:', accountUrl);

    const credential = new DefaultAzureCredential();
    const blobServiceClient = new BlobServiceClient(accountUrl, credential);

    let containers = [];
    for await (const container of blobServiceClient.listContainers()) {
      containers.push(container.name);
    }
    
    context.log('Contenedores encontrados:', containers);

    context.res = {
      status: 200,
      body: { containers }
    };
  } catch (error) {
    context.log.error('Error al listar contenedores:', error);
    context.res = {
      status: 500,
      body: 'Error: ' + (error.stack || error.message)
    };
  }
};