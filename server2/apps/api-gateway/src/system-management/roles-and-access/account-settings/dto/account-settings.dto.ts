import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class AccountSettings {
  @IsString()
  @IsNotEmpty()
  @Length(1, 15)
  username!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsOptional()
  @Length(8, 15)
  password!: string | null;
}
