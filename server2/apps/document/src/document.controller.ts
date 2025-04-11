import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { DocumentService } from './document.service';

@Controller()
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @MessagePattern({ cmd: 'store_document_file' })
  async uploadFile(payload: any) {
    return await this.documentService.handleFile(payload);
  }

  @MessagePattern({ cmd: 'get_document_metadata' })
  async getMetadata(payload: { id: number }) {
    return await this.documentService.getMetadata(payload);
  }

  @MessagePattern({ cmd: 'delete_document_file' })
  async deleteFile(payload: { id: number }) {
    return await this.documentService.handleDeleteFile(payload.id);
  }
}
