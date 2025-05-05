import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class UpdateProfileSettingsDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  fName!: string;

  @IsString()
  @IsOptional()
  mName!: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  lName!: string;

  @IsString()
  @IsOptional()
  @Length(0, 5)
  suffix!: string;

  @IsIn(['male', 'female', 'other'])
  @IsNotEmpty()
  gender!: string;

  @Matches(/^09\d{9}$/, {
    message: 'Phone number must start with 09 and be 11 digits long',
  })
  @IsNotEmpty()
  phone!: string;
}

export class CreateEmployeeDto extends UpdateProfileSettingsDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 15)
  username!: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 15)
  password!: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email!: string;
}
