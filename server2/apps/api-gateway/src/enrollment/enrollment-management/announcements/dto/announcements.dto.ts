import { IsBoolean, IsString } from 'class-validator';

export class ReceveInput {
  @IsBoolean()
  isActive: boolean;

  @IsString()
  subject: string;

  @IsString()
  contents: string;
}
