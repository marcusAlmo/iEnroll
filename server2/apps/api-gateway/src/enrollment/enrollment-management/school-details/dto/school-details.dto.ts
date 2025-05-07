import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsEmail,
  ValidationArguments,
  IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';

// Custom validator for Philippine mobile format (09XXXXXXXXX only)
@ValidatorConstraint({ name: 'IsPhilippinePhoneNumber', async: false })
class IsPhilippinePhoneNumberConstraint
  implements ValidatorConstraintInterface
{
  validate(phone: string, _args: ValidationArguments) {
    return /^09\d{9}$/.test(phone);
  }

  defaultMessage(_args: ValidationArguments) {
    return 'Contact number must be in the format 09XXXXXXXXX (11 digits total)';
  }
}

// Custom decorator for phone validation
function IsPhilippinePhoneNumber(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPhilippinePhoneNumberConstraint,
    });
  };
}

export class SchoolDetails {
  @IsString()
  @IsNotEmpty()
  schoolName!: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim()) // Trim whitespace
  @IsPhilippinePhoneNumber({
    message:
      'Contact number must start with 09 followed by 9 digits (e.g., 09123456789)',
  })
  schoolContact!: string;

  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty()
  schoolEmail!: string;

  @IsString()
  @IsOptional()
  schoolWebUrl?: string;

  @IsString()
  @IsNotEmpty()
  schoolAddress!: string;

  @IsNumber()
  @IsOptional()
  streetId?: number;

  @IsNumber()
  @IsNotEmpty()
  schoolId!: number;
}
