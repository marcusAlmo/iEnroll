import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class AccountSettings {
  @IsString()
  @IsNotEmpty()
  @Length(1, 15)
  username!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;
}

export class UpdatePassword {
  @IsString()
  @IsNotEmpty()
  @Length(1, 15)
  password!: string;
}
