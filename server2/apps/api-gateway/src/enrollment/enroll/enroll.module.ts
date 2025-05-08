import { Module } from '@nestjs/common';
import { EnrollController } from './enroll.controller';
import { EnrollService } from './enroll.service';
import { AuthModule } from '@lib/auth/auth.module';
import { ClientsModule } from '@nestjs/microservices';
import { rabbitMQConstants } from '@lib/constants/rabbit-mq.constants';
import { FileModule } from '../../file/file.module';
import { FileService } from '../../file/file.service';
import { PrismaService } from '@lib/prisma/src/prisma.service';

@Module({
  imports: [
    AuthModule,
    ClientsModule.register([rabbitMQConstants.ENROLLMENT]),
    ClientsModule.register([rabbitMQConstants.FILE]),
    FileModule,
  ],
  controllers: [EnrollController],
  providers: [EnrollService, FileService, PrismaService],
  exports: [EnrollService],
})
export class EnrollModule {}
