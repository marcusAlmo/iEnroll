import { IsDate, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class HistoryAndLogsDto {
  @IsString()
  @IsOptional()
  role?: string | null;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  startDate?: Date | null;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  endDate?: Date | null;
}
