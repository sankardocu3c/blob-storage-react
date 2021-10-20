// ./src/azure-storage-blob.ts

// <snippet_package>
// THIS IS SAMPLE CODE ONLY - NOT MEANT FOR PRODUCTION USE
import { BlobServiceClient, ContainerClient} from '@azure/storage-blob';

const containerName = `tutorial-container`;
const sasToken = process.env.REACT_APP_STORAGESASTOKEN;
const storageAccountName = process.env.REACT_APP_STORAGERESOURCENAME; 
// </snippet_package>

// <snippet_isStorageConfigured>
// Feature flag - disable storage feature to app if not configured
export const isStorageConfigured = async () => {
  return (!storageAccountName || !sasToken) ? false : true;
}
// </snippet_isStorageConfigured>

export const displayblob = async () => {
  const blobService = new BlobServiceClient(
    `https://${storageAccountName}.blob.core.windows.net/?${sasToken}`
  );
  const containerClient: ContainerClient = blobService.getContainerClient(containerName);
  await containerClient.createIfNotExists({
    access: 'container',
  });
  const returnedBlobUrls: string[] = [];
  const returnedBlobName: string[] = [];
  for await (const blob of containerClient.listBlobsFlat()) {
    returnedBlobUrls.push(
      `https://${storageAccountName}.blob.core.windows.net/${containerName}/${blob.name}`
    );
  }
  // console.log("in diplayblob section::")
  // console.log(returnedBlobUrls);
    return returnedBlobUrls;
}
// <snippet_getBlobsInContainer>
// return list of blobs in container to display

const getBlobsInContainer = async (containerClient: ContainerClient) => {
  
  const returnedBlobUrls: string[] = [];
  const returnedBlobName: string[] = [];
  // get list of blobs in container
  // eslint-disable-next-line
  for await (const blob of containerClient.listBlobsFlat()) {
    // if image is public, just construct URL
    returnedBlobUrls.push(
      `https://${storageAccountName}.blob.core.windows.net/${containerName}/${blob.name}`
    );
  }
    //return returnedBlobName;
    return returnedBlobUrls;
}
// </snippet_getBlobsInContainer>

// <snippet_createBlobInContainer>
const createBlobInContainer = async (containerClient: ContainerClient, file: File) => {
  
  // create blobClient for container
  const blobClient = containerClient.getBlockBlobClient(file.name);
  // set mimetype as determined from browser with file upload control
  const options = { blobHTTPHeaders: { blobContentType: file.type } };

  // upload file
  await blobClient.uploadData(file, options);
}
const deleteBlobInContainer = async (containerClient: ContainerClient, file: File) => {

  // create blobClient for container
  const blobClient =  containerClient.getBlockBlobClient(file);

  await blobClient.delete();
}
// </snippet_createBlobInContainer>


// <snippet_uploadFileToBlob>
export const uploadFileToBlob = async (file: File | null): Promise<string[]> => {
  if (!file) return [];

  // get BlobService = notice `?` is pulled out of sasToken - if created in Azure portal
  const blobService = new BlobServiceClient(
    `https://${storageAccountName}.blob.core.windows.net/?${sasToken}`
  );
  //BlobEndpoint=https://sankarblobstorage.blob.core.windows.net/;QueueEndpoint=https://sankarblobstorage.queue.core.windows.net/;FileEndpoint=https://sankarblobstorage.file.core.windows.net/;TableEndpoint=https://sankarblobstorage.table.core.windows.net/;SharedAccessSignature=sv=2020-08-04&ss=b&srt=sco&sp=rwdlactfx&se=2021-10-22T06:51:29Z&st=2021-10-20T06:51:29Z&spr=https&sig=e4b2Zwoy%2BLSD9m45x4ayBbkM2%2FeHbpgFlp9JBwgtU2g%3D
  // get Container - full public read access
  const containerClient: ContainerClient = blobService.getContainerClient(containerName);
  // await containerClient.createIfNotExists({
  //   access: 'container',
  // });

  // upload file
  //await createBlobInContainer(containerClient, file);

  // get list of blobs in container
  return getBlobsInContainer(containerClient);
};
// </snippet_uploadFileToBlob>

const deleteFileFromBlob = async (file: File | null): Promise<string[]> => {
  if (!file) return [];
  // get BlobService = notice `?` is pulled out of sasToken - if created in Azure portal
  const blobService = new BlobServiceClient(
    `https://${storageAccountName}.blob.core.windows.net/?${sasToken}`
  );

  // get Container - full public read access
  const containerClient: ContainerClient = blobService.getContainerClient(containerName);
  await containerClient.createIfNotExists({
    access: 'container',
  });

  // upload file
  await deleteBlobInContainer(containerClient, file);

  // get list of blobs in container
  // console.log(getBlobsInContainer(containerClient));
  return await getBlobsInContainer(containerClient);
};



export default deleteFileFromBlob;

