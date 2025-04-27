import { Module } from '@nestjs/common';
import { EnrollmentScheduleService } from './enrollment-schedule.service';
import { EnrollmentScheduleController } from './enrollment-schedule.controller';
import { ExceptionCheckerService } from '@lib/exception-checker/exception-checker.service';
import { ClientsModule } from '@nestjs/microservices';
import { rabbitMQConstants } from '@lib/constants/rabbit-mq.constants';

@Module({
  imports: [ClientsModule.register([rabbitMQConstants.ENROLLMENT])],
  providers: [EnrollmentScheduleService, ExceptionCheckerService],
  controllers: [EnrollmentScheduleController],
})
export class EnrollmentScheduleModule {}
