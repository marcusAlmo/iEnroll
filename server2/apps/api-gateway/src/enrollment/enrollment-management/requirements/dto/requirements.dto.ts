import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class RequirementsArr {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  type!: string;

  @IsString()
  @IsNotEmpty()
  dataType!: string;

  @IsBoolean()
  isRequired!: boolean;

  @IsString()
  @IsNotEmpty()
  description!: string;
}

export class AddRequirementDTO {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RequirementsArr)
  requirements!: RequirementsArr[];
}

export class RequirementsDTO {
  @IsNumber()
  @IsNotEmpty()
  gradeSectionProgramId!: number;

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

export class UpdateRequirementData {
  @IsString()
  @IsNotEmpty()
  dataType!: string;

  @IsNumber()
  @IsNotEmpty()
  requirementId!: number;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsBoolean()
  isRequired!: boolean;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  type!: string;
}

export class UpdateRequirementDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateRequirementData)
  data!: UpdateRequirementData[];
}
