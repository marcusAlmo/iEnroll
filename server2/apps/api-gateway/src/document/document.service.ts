import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  DeleteFileReturn,
  MetadataFileReturn,
  UploadFileReturn,
} from './document.types';
import { lastValueFrom } from 'rxjs';
import { join } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DocumentService {
  constructor(
    @Inject('DOCUMENT_SERVICE') private readonly client: ClientProxy,
  ) {}

  async uploadFile(file: Express.Multer.File) {
    const tempPath = join(__dirname, '..', '..', '..', 'temp');

    const tempPathFileName = join(tempPath, uuidv4());

    if (!existsSync(tempPath)) mkdirSync(tempPath);

    writeFileSync(tempPathFileName, file.buffer);

    const payload = {
      filepath: tempPathFileName,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      buffer: file.buffer,
    };

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
