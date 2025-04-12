import { DocumentService } from 'apps/document/src/document.service';

export type UploadFileReturn = Awaited<
  ReturnType<DocumentService['handleFile']>
>;
export type MetadataFileReturn = Awaited<
  ReturnType<DocumentService['getMetadata']>
>;
export type DeleteFileReturn = Awaited<
  ReturnType<DocumentService['handleDeleteFile']>
>;
