import {
  IsNumber,
  IsString,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class GradeLevelsDto {
  @IsNumber()
  @IsNotEmpty()
  gradeLevelOfferedId!: number;

  @IsNumber()
  @IsNotEmpty()
  sectionId!: number;

  @IsString()
  @IsOptional()
  programName?: string;

  @IsNumber()
  @IsOptional()
  programId?: number;

  @IsString()
  @IsNotEmpty()
  sectionName!: string;

  @IsString()
  @IsNotEmpty()
  adviser!: string;

  @IsNumber()
  @IsNotEmpty()
  admissionSlot!: number;

  @IsNumber()
  @IsNotEmpty()
  maxApplicationSlot!: number;

  @IsNumber()
  @IsNotEmpty()
  gradeSectionProgramId!: number;

  @IsBoolean()
  @IsNotEmpty()
  isUpdate!: boolean;
}

export class DeleteGradeLevelsDto {
  @IsNumber()
  @IsNotEmpty()
  sectionId!: number;
}
