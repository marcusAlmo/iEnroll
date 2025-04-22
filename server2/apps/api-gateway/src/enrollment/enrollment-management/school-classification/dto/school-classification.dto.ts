import { IsNullableString } from '@lib/decorators/is-nullable-string.decorator';
import { IsArray, IsString } from 'class-validator';

export class SchoolClassification {
  @IsString()
  @IsNullableString()
  schoolType!: string;

  @IsArray()
  @IsString({ each: true })
  acadLevels!: string[];

  @IsArray()
  @IsString({ each: true })
  gradeLevels!: string[];
}
