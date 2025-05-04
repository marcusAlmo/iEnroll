import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

class TimeRange {
  @IsString()
  @IsNotEmpty()
  startTime!: string;

  @IsString()
  @IsNotEmpty()
  endTime!: string;
}

class ScheduleDate {
  @IsString()
  @IsNotEmpty()
  DateString!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TimeRange)
  timeRanges!: TimeRange[];
}

export class EnrollmentScheduleDTO {
  @IsString()
  @IsNotEmpty()
  gradeLevel!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScheduleDate)
  schedDate!: ScheduleDate[];
}
