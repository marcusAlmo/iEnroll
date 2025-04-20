import { Module } from '@nestjs/common';
import { EnrollmentTrendDataService } from './enrollment-trend-data.service';
import { EnrollmentTrendDataController } from './enrollment-trend-data.controller';
import { DateTimeUtilityService } from '@lib/date-time-utility/date-time-utility.service';
import { MicroserviceUtilityService } from '@lib/microservice-utility/microservice-utility.service';
import { PrismaService } from '@lib/prisma/src/prisma.service';

@Module({
  providers: [
    EnrollmentTrendDataService,
    DateTimeUtilityService,
    MicroserviceUtilityService,
    PrismaService,
  ],
  controllers: [EnrollmentTrendDataController],
})
export class EnrollmentTrendDataModule {}
