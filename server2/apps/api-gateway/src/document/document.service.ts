import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class DocumentService {
  constructor(
    @Inject('DOCUMENT_SERVICE') private readonly client: ClientProxy,
  ) {}

  uploadFile(payload: any) {
    return this.client.send(
      {
        cmd: 'store_document_file',
      },
      payload,
    );
  }

  getMetadata(payload: any) {
    return this.client.send(
      {
        cmd: 'get_document_metadata',
      },
      payload,
    );
  }

  deleteFile(payload: any) {
    return this.client.send(
      {
        cmd: 'delete_document_file',
      },
      payload,
    );
  }
}
