import { Module } from '@nestjs/common';
import { EnrollmentScheduleService } from './enrollment-schedule.service';
import { EnrollmentScheduleController } from './enrollment-schedule.controller';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { MicroserviceUtilityService } from '@lib/microservice-utility/microservice-utility.service';

@Module({
  providers: [
    EnrollmentScheduleService,
    PrismaService,
    MicroserviceUtilityService,
  ],
  controllers: [EnrollmentScheduleController],
})
export class EnrollmentScheduleModule {}
