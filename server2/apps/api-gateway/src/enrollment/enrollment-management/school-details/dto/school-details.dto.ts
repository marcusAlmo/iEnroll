import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsEmail,
  ValidationArguments,
} from 'class-validator';
import { Transform } from 'class-transformer';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';

// ✅ Custom validator for Philippine mobile format
@ValidatorConstraint({ name: 'IsProperPhoneNumber', async: false })
class IsProperPhoneNumberConstraint implements ValidatorConstraintInterface {
  validate(phone: string, _args: ValidationArguments) {
    return /^\+639\d{9}$/.test(phone);
  }

  defaultMessage(_args: ValidationArguments) {
    return 'Contact number must be in the format +639XXXXXXXXX';
  }
}

// ✅ Custom decorator for phone validation
function IsProperPhoneNumber(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsProperPhoneNumberConstraint,
    });
  };
}

export class SchoolDetails {
  @IsString()
  @IsNotEmpty()
  schoolName!: string;

  @IsString()
  @IsNotEmpty()
  /**
   * @Transform(({ value }) => {
    // Convert 09XXXXXXXXX to +639XXXXXXXXX
    if (/^09\d{9}$/.test(value as string)) {
      return value.replace(/^0/, '+63') as string;
    }
    return value as string;
  })
  @IsProperPhoneNumber({ message: 'Contact must be in +639XXXXXXXXX format' })
   */
  schoolContact!: string;

  @IsNumber()
  @IsNotEmpty()
  schoolId!: number;

  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty()
  schoolEmail!: string;

  @IsString()
  schoolWebUrl!: string;

  @IsString()
  @IsNotEmpty()
  schoolAddress!: string;

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
}
