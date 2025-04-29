import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

class ScheduleDate {
  @IsBoolean()
  isPaused!: boolean;

  @IsString()
  dateString!: string;

  @IsString()
  startTime!: string;

  @IsString()
  endTime!: string;
}

export class EnrollmentScheduleDTO {
  @IsArray()
  @IsString({ each: true })
  gradeLevelCode!: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScheduleDate)
  schedDate!: ScheduleDate[];

  @IsBoolean()
  canChooseSection!: boolean;

  @IsNumber()
  slotCapacity!: number;
}
