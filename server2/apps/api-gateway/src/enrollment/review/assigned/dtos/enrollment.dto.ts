import { IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class EnrollDto {
  @Type(() => Number)
  @IsInt()
  studentId!: number;

  @Type(() => Number)
  @IsInt()
  sectionId!: number;

  @IsOptional()
  @IsString()
  enrollmentRemarks?: string;
}

export class ReassignDto {
  @Type(() => Number)
  @IsInt()
  studentId!: number;

  @Type(() => Number)
  @IsInt()
  sectionId!: number;
}
