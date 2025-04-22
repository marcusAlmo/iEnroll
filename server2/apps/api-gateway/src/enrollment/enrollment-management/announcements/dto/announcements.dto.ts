import { IsBoolean, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ReceveInput {
  @IsBoolean()
  @IsNotEmpty()
  isActive!: boolean;

  @IsString()
  @MaxLength(50, {
    message: 'Max length should be no longer than 50 characters',
  })
  @IsNotEmpty()
  subject!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255, {
    message: 'Contents must be at most 255 characters long.',
  })
  contents!: string;
}
