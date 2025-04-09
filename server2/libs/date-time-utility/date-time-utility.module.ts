import { Module } from '@nestjs/common';
import { DateTimeUtilityService } from './date-time-utility.service';

@Module({
  providers: [DateTimeUtilityService],
  exports: [DateTimeUtilityService],
})
export class DateTimeUtilityModule {}
