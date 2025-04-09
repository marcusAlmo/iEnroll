import {
  IsString,
  IsEmail,
  IsOptional,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber('PH')
  @IsNotEmpty()
  contactNumber: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsOptional()
  middleName?: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @Type(() => Date)
  @IsDate()
  dateOfBirth: Date;

  @IsEnum(['M', 'F'])
  sex: 'M' | 'F';

  @IsString()
  @IsNotEmpty()
  address: string;
}
