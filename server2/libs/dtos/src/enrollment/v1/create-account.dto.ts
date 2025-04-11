import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsNumber,
  IsDateString,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { IsPastDate } from '../../../../../apps/enrollment/src/create-account/validators/is-past-date.decorator';

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
  @IsPastDate(false, {
    message: 'Date of birth cannot be today or in the future.',
  })
  dateOfBirth: string | Date;

  @IsEnum(['M', 'F', 'O'])
  gender: 'M' | 'F' | 'O';

  // @IsString()
  // @IsNotEmpty()
  // address: string;

  @IsNumber()
  @IsNotEmpty()
  schoolId: number;

  // @IsNumber()
  // @IsNotEmpty()
  // addressId: number;

  @IsString()
  @IsNotEmpty()
  street: string;

  @IsString()
  @IsNotEmpty()
  district: string;

  @IsString()
  @IsNotEmpty()
  municipality: string;

  @IsNumber()
  @IsOptional()
  enrollerId?: number;
}
