import { Module } from '@nestjs/common';
import { EnrollmentScheduleService } from './enrollment-schedule.service';
import { EnrollmentScheduleController } from './enrollment-schedule.controller';

@Module({
  providers: [EnrollmentScheduleService],
  controllers: [EnrollmentScheduleController]
})
export class EnrollmentScheduleModule {}
