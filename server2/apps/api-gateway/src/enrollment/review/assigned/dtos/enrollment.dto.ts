import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
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

export enum EnrollmentStatus {
  ACCEPTED = 'accepted',
  DENIED = 'denied',
  INVALID = 'invalid',
}

export class UpdateEnrollmentDto {
  @IsEnum(EnrollmentStatus)
  status!: EnrollmentStatus;

  @Type(() => Number)
  @IsInt()
  studentId!: number;
}
