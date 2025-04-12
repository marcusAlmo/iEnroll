import { PrismaService } from '@lib/prisma/src/prisma.service';
import { Injectable } from '@nestjs/common';
import { writeFileSync, existsSync, mkdirSync, unlinkSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DocumentService {
  constructor(private prisma: PrismaService) {}

  async handleFile(payload: any) {
    try {
      const uploadDir = join(__dirname, '..', '..', '..', 'uploads');
      if (!existsSync(uploadDir)) mkdirSync(uploadDir);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const fileBuffer = Buffer.from(payload.buffer, 'base64');
      const finalName = `${uuidv4()}-${payload.originalName}`;
      const finalPath = join(uploadDir, finalName);

      writeFileSync(finalPath, fileBuffer);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      unlinkSync(payload.filepath);

      const document = await this.prisma.file.create({
        data: {
          name: payload.originalName,
          path: finalName,
          type: payload.mimetype,
          size: payload.size,
        },
      });

      return {
        success: true,
        document: {
          id: document.file_id,
          name: document.name,
          url: `/uploads/${finalName}`,
          type: document.type,
          size: document.size,
          createdAt: document.creation_datetime,
        },
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async getMetadata({ id }: { id: number }) {
    const document = await this.prisma.file.findUnique({
      where: { file_id: id },
    });
    if (!document) return { success: false, message: 'Document not found' };
    return {
      success: true,
      document: {
        id: document.file_id,
        name: document.name,
        url: `/uploads/${document.path}`,
        type: document.type,
        size: document.size,
        createdAt: document.creation_datetime,
      },
    };
  }

  async handleDeleteFile(id: number) {
    const document = await this.prisma.file.findUnique({
      where: { file_id: id },
    });

    if (!document) {
      throw new Error('Document not found');
    }

    try {
      // Delete the file from the filesystem

      unlinkSync(document.path);

      // Delete the document metadata from the database
      await this.prisma.file.delete({
        where: { file_id: id },
      });

      return { success: true, message: 'Document deleted successfully' };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}
