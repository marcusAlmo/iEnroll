import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  private checkIfImage(file: Express.Multer.File) {
    return file.mimetype.startsWith('image/');
  }

  @Post('blur')
  @UseInterceptors(FileInterceptor('image'))
  async checkIfBlurry(@UploadedFile() file: Express.Multer.File) {
    if (!this.checkIfImage(file))
      throw new BadRequestException('File must be an image!');
    return await this.imageService.checkIfBlurry(file);
  }

  @Post('extract/text')
  @UseInterceptors(FileInterceptor('image'))
  async extractTextFromImage(@UploadedFile() file: Express.Multer.File) {
    if (!this.checkIfImage(file))
      throw new BadRequestException('File must be an image!');
    return await this.imageService.extractTextFromImage(file);
  }

  @Post('payment/check')
  @UseInterceptors(FileInterceptor('image'))
  async checkIfPaymentMethod(@UploadedFile() file: Express.Multer.File) {
    if (!this.checkIfImage(file))
      throw new BadRequestException('File must be an image!');
    return this.imageService.checkIfPaymentMethod(file);
  }
}
