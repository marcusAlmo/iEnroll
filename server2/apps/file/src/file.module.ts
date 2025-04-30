import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { PrismaModule } from '@lib/prisma/src/prisma.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { OcrService } from '@lib/ocr/ocr.service';
import { BlurryDetectorService } from '@lib/blurry-detector/blurry-detector.service';
import { FileCommonService } from '@lib/file-common/file-common.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: false,
    }),
    PrismaModule,
  ],
  controllers: [FileController],
  providers: [
    FileService,
    OcrService,
    BlurryDetectorService,
    FileCommonService,
  ],
})
export class FileModule {}
