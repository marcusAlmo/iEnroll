import { Module } from '@nestjs/common';
import { EnrollController } from './enroll.controller';
import { EnrollService } from './enroll.service';
import { AuthModule } from '@lib/auth/auth.module';
import { ClientsModule } from '@nestjs/microservices';
import { rabbitMQConstants } from '@lib/constants/rabbit-mq.constants';
import { DocumentModule } from '../../document/document.module';
import { DocumentService } from '../../document/document.service';
import { PrismaService } from '@lib/prisma/src/prisma.service';

@Module({
  imports: [
    AuthModule,
    ClientsModule.register([rabbitMQConstants.ENROLLMENT]),
    ClientsModule.register([rabbitMQConstants.DOCUMENT]),
    DocumentModule,
  ],
  controllers: [EnrollController],
  providers: [EnrollService, DocumentService, PrismaService],
})
export class EnrollModule {}
