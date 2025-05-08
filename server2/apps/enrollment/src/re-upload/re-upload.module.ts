import { Module } from '@nestjs/common';
import { ReUploadService } from './re-upload.service';
import { ReUploadController } from './re-upload.controller';
import { PrismaService } from '@lib/prisma/src/prisma.service';

@Module({
  controllers: [ReUploadController],
  providers: [ReUploadService, PrismaService],
})
export class ReUploadModule {}
