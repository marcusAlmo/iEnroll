import { Module } from '@nestjs/common';
import { EnrollmentTrendDataService } from './enrollment-trend-data.service';
import { EnrollmentTrendDataController } from './enrollment-trend-data.controller';

@Module({
  providers: [EnrollmentTrendDataService],
  controllers: [EnrollmentTrendDataController]
})
export class EnrollmentTrendDataModule {}
