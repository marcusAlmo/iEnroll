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
  Query,
  ParseBoolPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentService } from './document.service';

@Controller('documents')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Query('ocr_enabled', new DefaultValuePipe(false), ParseBoolPipe)
    ocr: boolean,
    @Query('blurry_enabled', new DefaultValuePipe(false), ParseBoolPipe)
    blurry: boolean,
  ) {
    return await this.documentService.uploadFile(file, {
      ocrEnabled: ocr,
      blurEnabled: blurry,
    });
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
