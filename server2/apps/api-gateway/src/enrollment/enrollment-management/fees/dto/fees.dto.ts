import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class FeeDetailsDTO {
  @IsNumber()
  @IsNotEmpty()
  feeId!: number;

  @IsNumber()
  @IsNotEmpty()
  feeTypeId!: number;

  @IsString()
  @IsNotEmpty()
  feeName!: string;

  @IsNumber()
  @IsNotEmpty()
  amount!: number;

  @IsString()
  @IsOptional()
  description!: string | null;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  dueDate!: Date;
}

export class Fees {
  @IsString()
  @IsNotEmpty()
  gradeLevelCode!: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FeeDetailsDTO)
  newFees!: FeeDetailsDTO[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FeeDetailsDTO)
  existingFees!: FeeDetailsDTO[];
}
