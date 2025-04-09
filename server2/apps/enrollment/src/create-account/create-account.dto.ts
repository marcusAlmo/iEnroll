import {
  IsString,
  IsEmail,
  IsOptional,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsNumber,
  IsDateString,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

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

  @IsString()
  @IsOptional()
  suffix?: string;

  @Transform(({ value }) =>
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    typeof value === 'string' ? new Date(value) : value,
  )
  @IsDateString()
  dateOfBirth: string | Date;

  @IsEnum(['M', 'F'])
  gender: 'M' | 'F';

  // @IsString()
  // @IsNotEmpty()
  // address: string;

  @IsNumber()
  @IsNotEmpty()
  schoolId: number;

  @IsNumber()
  @IsNotEmpty()
  addressId: number;

  @IsNumber()
  @IsOptional()
  enrollerId?: number;
}
