import { IsNumber, IsString, IsBoolean } from 'class-validator';

export class GradeLevelsDto {
  @IsNumber()
  gradeLevelOfferedId!: number;

  @IsNumber()
  sectionId!: number;

  @IsString()
  programname!: string;

  @IsNumber()
  programId!: number;

  @IsString()
  sectionName!: string;

  @IsString()
  adviser!: string;

  @IsNumber()
  admissionSlot!: number;

  @IsNumber()
  maxApplicationSlot!: number;

  @IsNumber()
  gradeSectionProgramId!: number;

  @IsBoolean()
  isUpdate!: boolean;
}

export class DeleteGradeLevelsDto {
  @IsNumber()
  sectionId!: number;
}
