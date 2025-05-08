import { IsString } from 'class-validator';

export class ReuploadRequirementDto {
  @IsString()
  requirements!: string;
}
