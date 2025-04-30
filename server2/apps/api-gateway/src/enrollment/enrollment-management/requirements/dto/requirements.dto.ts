import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

class RequirementsArr {
  @IsString()
  name!: string;

  @IsString()
  type!: string;

  @IsString()
  dataType!: string;

  @IsBoolean()
  isRequired!: boolean;

  @IsString()
  description!: string;
}

export class RequirementsDTO {
  @IsArray()
  @IsString({ each: true })
  gradeLevelCodes!: string[];

  @IsArray()
  @IsNumber()
  sectionId!: number[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RequirementsArr)
  requirements!: RequirementsArr[];
}

export class SimpleRequirementDTO {
  @IsNumber()
  requirementId!: number;

  @IsBoolean()
  isRequired!: boolean;
}

export class UpdateRequirementsDTO {
  @IsBoolean()
  isRequired!: boolean;
}
