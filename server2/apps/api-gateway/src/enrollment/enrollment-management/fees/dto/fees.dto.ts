import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

class FeeDetailsDTO {
  @IsString()
  feeName!: string;

  @IsNumber()
  amount!: number;

  @IsString()
  description!: string | null;

  @Type(() => Date)
  @IsDate()
  dueDate!: Date;
}

export class Fees {
  @IsArray()
  @IsString({ each: true })
  gradeLevelCode!: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FeeDetailsDTO)
  feeDetailsArr!: FeeDetailsDTO[];
}
