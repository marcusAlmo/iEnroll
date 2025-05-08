import { Module } from '@nestjs/common';
import { ReUploadService } from './re-upload.service';
import { ReUploadController } from './re-upload.controller';

@Module({
  controllers: [ReUploadController],
  providers: [ReUploadService],
})
export class ReUploadModule {}
