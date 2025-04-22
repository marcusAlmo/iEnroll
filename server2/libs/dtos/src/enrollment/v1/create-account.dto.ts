import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsNumber,
  IsDate,
  IsStrongPassword,
  ValidateIf,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { IsPastDate } from '../../../../decorators/is-past-date.decorator';
import { IsValidAddressCombination } from './validate-address-combination.decorator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username!: string;

  @IsEmail()
  email!: string;

  @IsPhoneNumber('PH')
  @Transform(({ value }): string => {
    if (typeof value === 'string' && value.startsWith('+63')) {
      return '0' + value.slice(3);
    }
    return value;
  })
  @IsNotEmpty()
  contactNumber!: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword({
    minSymbols: 0,
    minLength: 8,
  })
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

  @Transform(
    ({ value }): Date => (typeof value === 'string' ? new Date(value) : value),
  )
  @IsDate()
  @IsPastDate(false, {
    message: 'Date of birth cannot be today or in the future.',
  })
  dateOfBirth!: Date;

  @IsEnum(['M', 'F', 'O'])
  gender!: 'M' | 'F' | 'O';

  @IsNumber()
  @IsNotEmpty()
  schoolId!: number;

  // -------------------------
  // Conditional Address Logic
  // -------------------------

  @ValidateIf((o) => !o.street && !o.district && !o.municipality && !o.province)
  @IsNumber()
  @IsOptional()
  streetId?: number;

  @IsNumber()
  @IsOptional()
  districtId?: number;

  @IsNumber()
  @IsOptional()
  municipalityId?: number;

  @IsNumber()
  @IsOptional()
  provinceId?: number;

  @IsString()
  @IsOptional()
  street?: string;

  @IsString()
  @IsOptional()
  district?: string;

  @IsString()
  @IsOptional()
  municipality?: string;

  @IsString()
  @IsOptional()
  province?: string;

  @IsNumber()
  @IsOptional()
  enrollerId?: number;

  @IsValidAddressCombination({
    message: 'Please enter a valid address combination.',
  })
  _?: any; // can be any property, class-validator needs a property to attach to
}
