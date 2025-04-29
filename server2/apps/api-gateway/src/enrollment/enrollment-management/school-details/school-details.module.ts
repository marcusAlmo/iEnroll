import { Module } from '@nestjs/common';
import { SchoolDetailsController } from './school-details.controller';
import { SchoolDetailsService } from './school-details.service';
import { ExceptionCheckerService } from '@lib/exception-checker/exception-checker.service';
import { ClientsModule } from '@nestjs/microservices';
import { rabbitMQConstants } from '@lib/constants/rabbit-mq.constants';

@Module({
  imports: [ClientsModule.register([rabbitMQConstants.ENROLLMENT])],
  controllers: [SchoolDetailsController],
  providers: [SchoolDetailsService, ExceptionCheckerService],
})
export class SchoolDetailsModule {}
