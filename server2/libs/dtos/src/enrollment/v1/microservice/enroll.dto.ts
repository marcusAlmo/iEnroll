import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { $Enums } from '@prisma/client';

export class RequirementTextDto {
  @IsNumber()
  requirementId!: number;

  @IsEnum([$Enums.attachment_type.text])
  attachmentType!: $Enums.attachment_type;

  @IsString()
  textContent!: string;

  @IsOptional()
  fileId?: never;
}

export class RequirementFileDto {
  @IsNumber()
  requirementId!: number;

  @IsEnum([$Enums.attachment_type.image, $Enums.attachment_type.document])
  attachmentType!: $Enums.attachment_type;

  @IsNumber()
  fileId!: number;

  @IsOptional()
  textContent?: never;
}

export class RequirementTextDtoHttp {
  @IsNumber()
  requirementId!: number;

  @IsEnum([$Enums.attachment_type.text])
  attachmentType!: $Enums.attachment_type;

  @IsString()
  textContent!: string;

  // @IsOptional()
  // fileId?: never;
}

export class RequirementFileDtoHttp {
  @IsNumber()
  requirementId!: number;

  @IsEnum([$Enums.attachment_type.image, $Enums.attachment_type.document])
  attachmentType!: $Enums.attachment_type;

  // @IsNumber()
  // fileId!: number;

  @IsOptional()
  textContent?: never;
}

export class PaymentDto {
  @IsNumber()
  fileId!: number;

  @IsNumber()
  paymentOptionId!: number;
}

export class PaymentDtoHttp {
  // @IsNumber()
  // fileId!: number;

  @IsNumber()
  paymentOptionId!: number;
}

export class DetailsDto {
  @IsNumber()
  studentId!: number;

  @IsNumber()
  schoolId!: number;

  @IsNumber()
  gradeSectionProgramId!: number;

  @IsNumber()
  scheduleId!: number;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsOptional()
  @IsNumber()
  gradeSectionId?: number;
}

export class DetailsDtoHttp {
  @IsNumber()
  gradeSectionProgramId!: number;

  @IsNumber()
  scheduleId!: number;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsOptional()
  @IsNumber()
  gradeSectionId?: number;
}

export class EnrollmentApplicationDto {
  @ValidateNested()
  @Type(() => DetailsDto)
  details!: DetailsDto;

  @ValidateNested({ each: true })
  @Type(() => Object, {
    discriminator: {
      property: 'attachmentType',
      subTypes: [
        {
          value: RequirementTextDto,
          name: $Enums.attachment_type.text,
        },
        {
          value: RequirementFileDto,
          name: $Enums.attachment_type.image,
        },
        {
          value: RequirementFileDto,
          name: $Enums.attachment_type.document,
        },
      ],
    },
    keepDiscriminatorProperty: true,
  })
  requirements!: (RequirementTextDto | RequirementFileDto)[];

  @ValidateNested()
  @Type(() => PaymentDto)
  payment!: PaymentDto;
}

export class EnrollmentApplicationDtoHttp {
  @ValidateNested()
  @Type(() => DetailsDtoHttp)
  details!: DetailsDtoHttp;

  @ValidateNested({ each: true })
  @Type(() => Object, {
    discriminator: {
      property: 'attachmentType',
      subTypes: [
        {
          value: RequirementTextDtoHttp,
          name: $Enums.attachment_type.text,
        },
        {
          value: RequirementFileDtoHttp,
          name: $Enums.attachment_type.image,
        },
        {
          value: RequirementFileDtoHttp,
          name: $Enums.attachment_type.document,
        },
      ],
    },
    keepDiscriminatorProperty: true,
  })
  requirements!: (RequirementTextDtoHttp | RequirementFileDtoHttp)[];

  @ValidateNested()
  @Type(() => PaymentDtoHttp)
  payment!: PaymentDtoHttp;
}
