import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class AuthDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
}
