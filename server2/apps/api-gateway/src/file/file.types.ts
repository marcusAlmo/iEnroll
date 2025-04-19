import { FileController } from 'apps/file/src/file.controller';

export type UploadFileReturn = Awaited<
  ReturnType<FileController['uploadFile']>
>;
export type UploadFileParams = Parameters<FileController['uploadFile']>[0];

export type MetadataFileReturn = Awaited<
  ReturnType<FileController['getMetadata']>
>;
export type MetadataFileParams = Parameters<FileController['getMetadata']>[0];

export type FileUUIDReturn = Awaited<
  ReturnType<FileController['getFileByUUID']>
>;
export type FileUUIDParams = Parameters<FileController['getFileByUUID']>[0];

export type DeleteFileReturn = Awaited<
  ReturnType<FileController['deleteFile']>
>;
export type DeleteFileParams = Parameters<FileController['deleteFile']>[0];
