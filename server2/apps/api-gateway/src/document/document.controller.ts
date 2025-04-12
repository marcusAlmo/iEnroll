// src/document/document.controller.ts
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Delete,
  Param,
  ParseIntPipe,
  Get,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { DocumentService } from './document.service';

@Controller('documents')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    const tempPath = join(__dirname, '..', '..', '..', 'temp', uuidv4());
    if (!existsSync(tempPath)) mkdirSync(tempPath);

    writeFileSync(tempPath, file.buffer);

    const payload = {
      filepath: tempPath,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      buffer: file.buffer,
    };

    return await this.documentService.uploadFile(payload);
  }

  @Get(':id')
  async getMetadata(@Param('id', ParseIntPipe) id: number) {
    return await this.documentService.getMetadata({ id });
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.documentService.deleteFile({ id });
  }
}
