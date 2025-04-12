import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  DeleteFileReturn,
  MetadataFileReturn,
  UploadFileReturn,
} from './document.types';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class DocumentService {
  constructor(
    @Inject('DOCUMENT_SERVICE') private readonly client: ClientProxy,
  ) {}

  async uploadFile(payload: any) {
    const result: UploadFileReturn = await lastValueFrom(
      this.client.send(
        {
          cmd: 'store_document_file',
        },
        payload,
      ),
    );
    return result;
  }

  async getMetadata(payload: any) {
    const result: MetadataFileReturn = await lastValueFrom(
      this.client.send(
        {
          cmd: 'get_document_metadata',
        },
        payload,
      ),
    );
    return result;
  }

  async deleteFile(payload: any) {
    const result: DeleteFileReturn = await lastValueFrom(
      this.client.send(
        {
          cmd: 'delete_document_file',
        },
        payload,
      ),
    );
    return result;
  }
}
