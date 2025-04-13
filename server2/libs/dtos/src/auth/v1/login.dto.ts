import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class LoginDto {
  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  emailEntered?: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  password!: string;
}

export interface validateSuccessType {
  userId: number;
  username: string;
}
