import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { FileService } from './file.service';
import { ModulePluginOptions } from './interfaces/module-plugin-options.interface';

type UploadFilePayloadParams = Parameters<FileService['handleFile']>[0];
type GetFileMetaDataParams = Parameters<FileService['getMetadata']>[0];
type GetFileByUUIDParams = Parameters<FileService['getFileByUUID']>[0];

interface Payloads {
  file: UploadFilePayloadParams;
  options: ModulePluginOptions;
}

@Controller()
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @MessagePattern({ cmd: 'store_file' })
  async uploadFile(payload: UploadFilePayloadParams) {
    return await this.fileService.handleFile(payload);
  }

  @MessagePattern({ cmd: 'store_file_plugin_enabled' })
  async uploadFilePluginEnabled(payload: Payloads) {
    return await this.fileService.handleFile(payload.file, payload.options);
  }

  @MessagePattern({ cmd: 'get_metadata' })
  async getMetadata(payload: GetFileMetaDataParams) {
    return await this.fileService.getMetadata(payload);
  }

  @MessagePattern({ cmd: 'get_file_by_uuid' })
  async getFileByUUID(payload: GetFileByUUIDParams) {
    return await this.fileService.getFileByUUID(payload);
  }

  @MessagePattern({ cmd: 'get_metadata_plugin_enabled' })
  async getMetadataPluginEnabled(payload: {
    uuid: string;
    schoolId: number;
    options: ModulePluginOptions;
  }) {
    return await this.fileService.getMetadata({
      uuid: payload.uuid,
      schoolId: payload.schoolId,
    });
  }

  @MessagePattern({ cmd: 'delete_file' })
  async deleteFile(payload: { fileId: number }) {
    return await this.fileService.handleDeleteFile(payload.fileId);
  }
}
