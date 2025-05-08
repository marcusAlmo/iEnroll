import { Module } from '@nestjs/common';
import { ReUploadService } from './re-upload.service';
import { ReUploadController } from './re-upload.controller';
import { rabbitMQConstants } from '@lib/constants/rabbit-mq.constants';
import { ClientsModule } from '@nestjs/microservices';
import { EnrollService } from '../enroll/enroll.service';
import { FileService } from '../../file/file.service';

@Module({
  imports: [
    ClientsModule.register([rabbitMQConstants.ENROLLMENT]),
    ClientsModule.register([rabbitMQConstants.FILE]),
  ],
  controllers: [ReUploadController],
  providers: [ReUploadService, EnrollService, FileService],
})
export class ReUploadModule {}
