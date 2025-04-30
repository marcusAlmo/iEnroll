import { IsEnum, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class ApproveOrDenyDto {
  @IsEnum(['approve', 'deny'])
  action: 'approve' | 'deny';

  @Type(() => Number)
  @IsInt()
  applicationId!: number;

  @Type(() => Number)
  @IsInt()
  requirementId!: number;

  @Type(() => Number)
  @IsInt()
  reviewerId!: number;
}
