import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { DocumentService } from './document.service';
import { ModulePluginOptions } from './interfaces/module-plugin-options.interface';

interface Payloads {
  file: any;
  options: ModulePluginOptions;
}

@Controller()
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @MessagePattern({ cmd: 'store_document_file' })
  async uploadFile(payload: any) {
    return await this.documentService.handleFile(payload);
  }

  @MessagePattern({ cmd: 'store_document_file_plugin_enabled' })
  async uploadFilePluginEnabled(payload: Payloads) {
    return await this.documentService.handleFile(payload.file, payload.options);
  }

  @MessagePattern({ cmd: 'get_document_metadata' })
  async getMetadata(payload: { id: number }) {
    return await this.documentService.getMetadata(payload);
  }

  @MessagePattern({ cmd: 'get_document_metadata_plugin_enabled' })
  async getMetadataPluginEnabled(payload: {
    id: number;
    options: ModulePluginOptions;
  }) {
    return await this.documentService.getMetadata(
      { id: payload.id },
      payload.options,
    );
  }

  @MessagePattern({ cmd: 'delete_document_file' })
  async deleteFile(payload: { id: number }) {
    return await this.documentService.handleDeleteFile(payload.id);
  }
}
