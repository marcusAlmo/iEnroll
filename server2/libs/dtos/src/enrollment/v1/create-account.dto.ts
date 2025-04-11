import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsNumber,
  IsDate,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { IsPastDate } from '../validators/is-past-date.decorator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username!: string;

  @IsEmail()
  email!: string;

  @IsPhoneNumber('PH')
  @Transform(({ value }) => {
    if (typeof value === 'string' && value.startsWith('+63')) {
      return '0' + value.slice(3);
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return value;
  })
  @IsNotEmpty()
  contactNumber!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;

  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsString()
  @IsOptional()
  middleName?: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @IsString()
  @IsOptional()
  suffix?: string;

  @Transform(({ value }) =>
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    typeof value === 'string' ? new Date(value) : value,
  )
  @IsDate()
  @IsPastDate(false, {
    message: 'Date of birth cannot be today or in the future.',
  })
  dateOfBirth!: Date;

  @IsEnum(['M', 'F', 'O'])
  gender!: 'M' | 'F' | 'O';

  // @IsString()
  // @IsNotEmpty()
  // address: string;

  @IsNumber()
  @IsNotEmpty()
  schoolId!: number;

  // @IsNumber()
  // @IsNotEmpty()
  // addressId: number;

  @IsString()
  @IsNotEmpty()
  street!: string;

  @IsString()
  @IsNotEmpty()
  district!: string;

  @IsString()
  @IsNotEmpty()
  municipality!: string;

  @IsString()
  @IsNotEmpty()
  province!: string;

  @IsNumber()
  @IsOptional()
  enrollerId?: number;
}
