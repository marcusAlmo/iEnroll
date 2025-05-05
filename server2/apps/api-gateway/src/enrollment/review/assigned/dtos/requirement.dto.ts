import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class ApproveOrDenyDto {
  @IsEnum(['approve', 'deny'])
  action!: 'approve' | 'deny';

  @Type(() => Number)
  @IsInt()
  applicationId!: number;

  @Type(() => Number)
  @IsInt()
  requirementId!: number;

  @IsOptional()
  @IsString()
  remarks?: string;
}
