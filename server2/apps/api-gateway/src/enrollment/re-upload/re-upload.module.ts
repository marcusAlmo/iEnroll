import { Module } from '@nestjs/common';
import { ReUploadService } from './re-upload.service';
import { ReUploadController } from './re-upload.controller';
import { rabbitMQConstants } from '@lib/constants/rabbit-mq.constants';
import { ClientsModule } from '@nestjs/microservices';

@Module({
  imports: [ClientsModule.register([rabbitMQConstants.ENROLLMENT])],
  controllers: [ReUploadController],
  providers: [ReUploadService],
})
export class ReUploadModule {}
