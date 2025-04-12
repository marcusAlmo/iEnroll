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
import { ModulePluginOptions } from 'apps/document/src/interfaces/module-plugin-options.interface';

@Injectable()
export class DocumentService {
  constructor(
    @Inject('DOCUMENT_SERVICE') private readonly client: ClientProxy,
  ) {}

  async uploadFile(
    file: Express.Multer.File,
    options?: {
      blurEnabled: boolean;
      ocrEnabled: boolean;
    },
  ) {
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
          cmd: options
            ? 'store_document_file_plugin_enabled'
            : 'store_document_file',
        },
        options
          ? {
              file: payload,
              options: {
                ocr: options.ocrEnabled,
                burryDetector: options.blurEnabled,
              } as ModulePluginOptions,
            }
          : payload,
      ),
    );
    return result;
  }

  async getMetadata(
    payload: { id: number },
    options?: {
      blurEnabled: boolean;
      ocrEnabled: boolean;
    },
  ) {
    const result: MetadataFileReturn = await lastValueFrom(
      this.client.send(
        {
          cmd: options
            ? 'get_document_metadata_plugin_enabled'
            : 'get_document_metadata',
        },
        options
          ? {
              file: payload,
              options: {
                ocr: options.ocrEnabled,
                burryDetector: options.blurEnabled,
              } as ModulePluginOptions,
            }
          : payload,
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
