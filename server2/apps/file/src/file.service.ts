import { existsSync, mkdirSync, unlinkSync } from 'fs';
import { join } from 'path';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { v4 as uuidv4 } from 'uuid';
import sanitize from 'sanitize-filename';

// App-specific imports
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { OcrService } from '@lib/ocr/ocr.service';
import { BlurryDetectorService } from '@lib/blurry-detector/blurry-detector.service';
import { CryptoUtils } from '@lib/utils/crypto.utils';
import { MAX_FILE_SIZE_BYTES, UPLOADDIR } from '@lib/constants/file.constants';
import { ModulePluginOptions } from './interfaces/module-plugin-options.interface';

// import * as fileTypeLib from 'file-type';

@Injectable()
export class FileService {
  private readonly uploadDir = UPLOADDIR;
  private readonly logger = new Logger(FileService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly ocrService: OcrService,
    private readonly blurryDetectorService: BlurryDetectorService,
  ) {
    if (!existsSync(this.uploadDir)) mkdirSync(this.uploadDir);
  }

  // === Validation and Sanitization ===

  private sanitizeFileName(fileName: string): string {
    const sanitized = sanitize(fileName).replace(/\s+/g, '_');
    return sanitized;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private async validateFile(buffer: Buffer, mimetype: string) {
    if (buffer.length > MAX_FILE_SIZE_BYTES) {
      throw new RpcException({
        statusCode: 400,
        message: 'ERR_FILE_EXCEEDS_MAX_SIZE',
      });
    }

    //? Accepted file types filtering
    // const fileType = await fileTypeLib.fileTypeFromBuffer(buffer);
    // if (!fileType || !mimetype.startsWith(fileType.mime.split('/')[0])) {
    //   throw new RpcException('Invalid or mismatched file type.');
    // }

    // ? ClamAV scanner
    // const scanResult = await this.scanner.scanBuffer(buffer);
    // if (scanResult.includes('FOUND')) {
    //   throw new RpcException('Virus detected in file.');
    // }
  }

  // === Helpers ===

  private async getSchoolById(schoolId: number) {
    const school = await this.prisma.school.findFirst({
      where: { school_id: schoolId },
    });
    if (!school) {
      throw new RpcException({
        statusCode: 404,
        message: 'ERR_SCHOOL_NOT_FOUND',
      });
    }
    return school;
  }

  private async streamEncryptToFile(
    buffer: Buffer<ArrayBuffer>,
    filePath: string,
    key: Buffer<ArrayBuffer>,
    iv: Buffer<ArrayBuffer>,
  ): Promise<void> {
    if (!existsSync(this.uploadDir)) mkdirSync(this.uploadDir);
    return new Promise((resolve, reject) => {
      const { cipher, stream } = CryptoUtils.createEncryptionStream({
        filePath,
        key,
        iv,
      });

      stream.on('finish', resolve);
      stream.on('error', reject);

      cipher.end(buffer);
      cipher.pipe(stream);
    });
  }

  // === Plugin Processing ===

  private async processPlugins(
    buffer: Buffer,
    filePath: string,
    mimetype: string,
    options?: ModulePluginOptions,
  ): Promise<Record<string, any> | undefined> {
    if (!options) return undefined;

    const result: Record<string, any> = {};

    if (options.burryDetector && mimetype.startsWith('image/')) {
      result.isBlurry =
        await this.blurryDetectorService.isImageBlurry(filePath);
    }

    if (options.ocr && buffer) {
      result.ocr = await this.ocrService.extractText(buffer);
    }

    return result;
  }

  // === Core Functionality ===

  async handleFile(
    payload: {
      filepath: string;
      originalName: string;
      mimetype: string;
      size: number;
      buffer: Buffer;
      schoolId: number;
    },
    options?: ModulePluginOptions,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const school = await this.getSchoolById(payload.schoolId);
    this.logger.debug(
      `Initialing upload file for file ${payload.originalName}`,
    );
    this.logger.debug('payload', payload);

    const buffer = Buffer.from(payload.buffer);
    const sanitizedFileName = this.sanitizeFileName(payload.originalName);
    const fileName = `${uuidv4()}-${sanitizedFileName}.bin`;
    const filePath = join(this.uploadDir, fileName);
    const schoolId = payload.schoolId;

    this.logger.debug('Validating File');
    await this.validateFile(buffer, payload.mimetype);
    this.logger.debug('Validated');

    const key = Buffer.from(CryptoUtils.getUserKey(schoolId));
    const iv = CryptoUtils.createRandomBytes(16);

    this.logger.debug('Encrypting');
    await this.streamEncryptToFile(buffer, filePath, key, iv);
    this.logger.debug('Encrypted');

    unlinkSync(payload.filepath); // cleanup temp

    const file = await this.prisma.file.create({
      data: {
        name: payload.originalName,
        path: fileName,
        type: payload.mimetype,
        size: payload.size,
        iv: iv.toString('hex'),
        school_id: schoolId,
      },
    });

    const plugins = await this.processPlugins(
      buffer,
      filePath,
      payload.mimetype,
      options,
    );

    return {
      success: true,
      document: {
        id: file.file_id,
        name: file.name,
        url: `/api/file/${file.uuid}`,
        type: file.type,
        size: file.size,
        createdAt: file.creation_datetime,
        uuid: file.uuid,
      },
      plugins,
    };
  }

  // === File Metadata ===

  async getFileByUUID({ uuid, schoolId }: { uuid: string; schoolId: number }) {
    const file = await this.prisma.file.findFirst({
      where: { uuid },
    });
    if (!file) {
      throw new RpcException({
        statusCode: 404,
        message: 'ERR_FILE_NOT_FOUND',
      });
    }

    console.log(schoolId, file.school_id);

    if (!(schoolId === file.school_id)) {
      throw new RpcException({
        statusCode: HttpStatus.FORBIDDEN,
        message: 'ERR_FILE_ACCESS_DENIED',
        error: `Access to file ${uuid} is denied for school ID ${schoolId}.`,
      });
    }

    return file;
  }

  async getMetadata({ uuid, schoolId }: { uuid: string; schoolId: number }) {
    const file = await this.getFileByUUID({ uuid, schoolId });

    return {
      success: true,
      document: {
        id: file.file_id,
        name: file.name,
        url: `/uploads/${file.path}`,
        type: file.type,
        size: file.size,
        uuid: file.uuid,
        createdAt: file.creation_datetime,
      },
    };
  }

  // === File Deletion ===

  async handleDeleteFile(fileId: number) {
    const file = await this.prisma.file.findUnique({
      where: { file_id: fileId },
    });
    if (!file)
      throw new RpcException({
        statusCode: 404,
        message: 'ERR_FILE_NOT_FOUND',
      });

    unlinkSync(join(this.uploadDir, file.path));
    await this.prisma.file.delete({ where: { file_id: fileId } });

    return { success: true, message: 'Document deleted successfully' };
  }
}
