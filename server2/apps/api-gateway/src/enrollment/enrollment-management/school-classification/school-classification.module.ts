import { Module } from '@nestjs/common';
import { SchoolClassificationController } from './school-classification.controller';
import { SchoolClassificationService } from './school-classification.service';
import { ExceptionCheckerService } from '@lib/exception-checker/exception-checker.service';
import { ClientsModule } from '@nestjs/microservices';
import { rabbitMQConstants } from '@lib/constants/rabbit-mq.constants';

@Module({
  imports: [ClientsModule.register([rabbitMQConstants.ENROLLMENT])],
  controllers: [SchoolClassificationController],
  providers: [SchoolClassificationService, ExceptionCheckerService],
})
export class SchoolClassificationModule {}
