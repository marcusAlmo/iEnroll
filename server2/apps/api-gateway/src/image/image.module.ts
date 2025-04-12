import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { OcrService } from '@lib/ocr/ocr.service';
import { BlurryDetectorService } from '@lib/blurry-detector/blurry-detector.service';
import { rabbitMQConstants } from '@lib/constants/rabbit-mq.constants';
import { ClientsModule } from '@nestjs/microservices';

@Module({
  imports: [ClientsModule.register([rabbitMQConstants.IMAGE])],
  providers: [ImageService, OcrService, BlurryDetectorService],
  controllers: [ImageController],
})
export class ImageModule {}
