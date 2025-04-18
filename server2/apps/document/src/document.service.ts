import { Injectable } from '@nestjs/common';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { OcrService } from '@lib/ocr/ocr.service';
import { BlurryDetectorService } from '@lib/blurry-detector/blurry-detector.service';
import {
  writeFileSync,
  existsSync,
  mkdirSync,
  unlinkSync,
  readFileSync,
} from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ModulePluginOptions } from './interfaces/module-plugin-options.interface';

@Injectable()
export class DocumentService {
  private readonly uploadDir = join(__dirname, '..', '..', '..', 'uploads');

  constructor(
    private readonly prisma: PrismaService,
    private readonly ocrService: OcrService,
    private readonly blurryDetectorService: BlurryDetectorService,
  ) {
    if (!existsSync(this.uploadDir)) mkdirSync(this.uploadDir);
  }

  private async processPlugins(
    filePath: string,
    mimetype: string,
    buffer?: Buffer,
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

  async handleFile(payload: any, options?: ModulePluginOptions) {
    try {
      const buffer = Buffer.from(payload.buffer, 'base64');
      const fileName = `${uuidv4()}-${payload.originalName}`;
      const filePath = join(this.uploadDir, fileName);

      writeFileSync(filePath, buffer);
      unlinkSync(payload.filepath); // Delete temporary file

      const file = await this.prisma.file.create({
        data: {
          name: payload.originalName,
          path: fileName,
          type: payload.mimetype,
          size: payload.size,
        },
      });

      const plugins = await this.processPlugins(
        filePath,
        payload.mimetype,
        buffer,
        options,
      );

      return {
        success: true,
        document: {
          id: file.file_id,
          name: file.name,
          url: `/uploads/${fileName}`,
          type: file.type,
          size: file.size,
          createdAt: file.creation_datetime,
        },
        plugins,
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async getMetadata({ id }: { id: number }, options?: ModulePluginOptions) {
    const file = await this.prisma.file.findUnique({ where: { file_id: id } });
    if (!file) return { success: false, message: 'Document not found' };

    const filePath = join(this.uploadDir, file.path);
    const buffer = options?.ocr ? readFileSync(filePath) : undefined;

    const plugins = await this.processPlugins(
      filePath,
      file.type,
      buffer,
      options,
    );

    return {
      success: true,
      document: {
        id: file.file_id,
        name: file.name,
        url: `/uploads/${file.path}`,
        type: file.type,
        size: file.size,
        createdAt: file.creation_datetime,
      },
      plugins,
    };
  }

  async handleDeleteFile(id: number) {
    const file = await this.prisma.file.findUnique({ where: { file_id: id } });
    if (!file) throw new Error('Document not found');

    try {
      unlinkSync(join(this.uploadDir, file.path));
      await this.prisma.file.delete({ where: { file_id: id } });

      return { success: true, message: 'Document deleted successfully' };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}
