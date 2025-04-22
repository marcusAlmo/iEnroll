import { Module } from '@nestjs/common';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { BlurryDetectorService } from '@lib/blurry-detector/blurry-detector.service';
import { OcrService } from '@lib/ocr/ocr.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: false,
    }),
  ],
  controllers: [ImageController],
  providers: [ImageService, OcrService, BlurryDetectorService],
})
export class ImageModule {}
