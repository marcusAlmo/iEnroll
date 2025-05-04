import { IsOptional, IsString } from 'class-validator';

export class EmployeeListDto {
  @IsString()
  @IsOptional()
  name!: string;
}
