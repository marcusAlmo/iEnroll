import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class RoleManagement {
  @IsString()
  @IsNotEmpty()
  @IsIn(['admin', 'registrar', 'parent', 'student'])
  role!: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['read', 'modify'])
  dashboardAccess!: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['read', 'modify'])
  enrollmentReview!: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['read', 'modify'])
  enrollmentManagement!: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['read', 'modify'])
  personnelCenter!: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['read', 'modify'])
  systemSettings!: string;
}
