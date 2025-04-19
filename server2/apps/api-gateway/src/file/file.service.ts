import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  DeleteFileParams,
  DeleteFileReturn,
  MetadataFileParams,
  MetadataFileReturn,
  UploadFileReturn,
  FileUUIDReturn,
  FileUUIDParams,
} from './file.types';
import { lastValueFrom } from 'rxjs';
import { join } from 'path';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { ModulePluginOptions } from 'apps/file/src/interfaces/module-plugin-options.interface';
import { TEMPDIR } from '@lib/constants/file.constants';
import { Readable } from 'stream';

@Injectable()
export class FileService {
  private readonly tempPath = TEMPDIR;

  constructor(@Inject('FILE_SERVICE') private readonly client: ClientProxy) {}

  async uploadFile(
    file: Express.Multer.File,
    schoolId: number,
    options?: {
      blurEnabled: boolean;
      ocrEnabled: boolean;
    },
  ) {
    const tempPathFileName = join(this.tempPath, uuidv4());

    if (!existsSync(this.tempPath)) {
      mkdirSync(this.tempPath, { recursive: true });
    }

    await new Promise<void>((resolve, reject) => {
      const readable = Readable.from(file.buffer);
      const writeStream = createWriteStream(tempPathFileName);
      readable.pipe(writeStream);
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });

    const payload = {
      filepath: tempPathFileName,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      buffer: file.buffer,
      schoolId,
    };

    const result: UploadFileReturn = await lastValueFrom(
      this.client.send(
        {
          cmd: options ? 'store_file_plugin_enabled' : 'store_file',
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
    payload: { uuid: string; schoolId: number },
    options?: {
      blurEnabled: boolean;
      ocrEnabled: boolean;
    },
  ) {
    const result: MetadataFileReturn = await lastValueFrom(
      this.client.send(
        {
          cmd: options ? 'get_metadata_plugin_enabled' : 'get_metadata',
        },
        (options
          ? {
              file: payload,
              options: {
                ocr: options.ocrEnabled,
                burryDetector: options.blurEnabled,
              } as ModulePluginOptions,
            }
          : payload) as MetadataFileParams,
      ),
    );
    return result;
  }

  async getFileByUUID(payload: FileUUIDParams) {
    const result: FileUUIDReturn = await lastValueFrom(
      this.client.send(
        {
          cmd: 'get_file_by_uuid',
        },
        payload,
      ),
    );
    return result;
  }

  async deleteFile(payload: { fileId: number }) {
    const result: DeleteFileReturn = await lastValueFrom(
      this.client.send(
        {
          cmd: 'delete_file',
        },
        payload as DeleteFileParams,
      ),
    );
    return result;
  }
}
