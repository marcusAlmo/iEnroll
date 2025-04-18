// src/document/file.controller.ts
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
  UseGuards,
  BadRequestException,
  Res,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { User } from '@lib/decorators/user.decorator';
import { JwtAuthGuard } from '@lib/auth/guards/jwt-auth.guard';
import { Response } from 'express';
import { join } from 'path';
import { CryptoUtils } from '@lib/utils/crypto.utils';
import { UPLOADDIR } from '@lib/constants/file.constants';

@Controller('file')
@UseGuards(JwtAuthGuard)
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Query('ocr_enabled', new DefaultValuePipe(false), ParseBoolPipe)
    ocr: boolean,
    @Query('blurry_enabled', new DefaultValuePipe(false), ParseBoolPipe)
    blurry: boolean,
    @User('school_id') schoolId: number,
  ) {
    if (!file) {
      throw new BadRequestException('ERR_FILE_NOT_FOUND');
    }

    return this.fileService.uploadFile(file, schoolId, {
      ocrEnabled: ocr,
      blurEnabled: blurry,
    });
  }

  @Get(':uuid/meta')
  async getMetadata(
    @Param(
      'uuid',
      new ParseUUIDPipe({
        exceptionFactory: () => new BadRequestException('ERR_INVALID_UUID'),
        version: '4',
      }),
    )
    uuid: string,
    @User('school_id') schoolId: number,
  ) {
    return this.fileService.getMetadata({ uuid, schoolId });
  }

  @Get(':uuid')
  async getFile(
    @Param(
      'uuid',
      new ParseUUIDPipe({
        exceptionFactory: () => new BadRequestException('ERR_INVALID_UUID'),
        version: '4',
      }),
    )
    uuid: string,
    @User('school_id') schoolId: number,
    @Query(
      'download',
      new DefaultValuePipe(true),
      new ParseBoolPipe({
        exceptionFactory: () =>
          new BadRequestException('ERR_INVALID_DOWNLOAD_QUERY'),
      }),
    )
    download: boolean,
    @Res() res: Response,
  ) {
    const file = await this.fileService.getFileByUUID({ uuid });
    const filePath = join(UPLOADDIR, file.path);
    const key = Buffer.from(CryptoUtils.getUserKey(schoolId));
    const iv = Buffer.from(file.iv, 'hex');

    const { decipher, stream } = CryptoUtils.createDecryptionStream({
      filePath,
      key,
      iv,
    });

    res
      .status(200)
      .setHeader('Content-Type', file.type || 'application/octet-stream')
      .setHeader(
        'Content-Disposition',
        `${download ? 'attachment' : 'inline'}; filename="${file.name}"`,
      );

    stream.pipe(decipher).pipe(res);
  }

  @Delete(':file_id')
  async delete(@Param('file_id', ParseIntPipe) fileId: number) {
    return this.fileService.deleteFile({ fileId });
  }
}
