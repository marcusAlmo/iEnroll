import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class PaymentDto {
  @Transform(({ value }: { value: string }) => parseInt(value, 10))
  @IsNumber()
  @IsNotEmpty()
  paymentOptionId!: number;
}

export class RequirementTextDto {
  @Transform(({ value }: { value: string }) => parseInt(value, 10))
  @IsNumber()
  @IsNotEmpty()
  requirementId!: number;

  @IsEnum(['text'])
  type!: 'text';

  @IsString()
  value!: string;
}

export class RequirementDocumentDto {
  @Transform(({ value }: { value: string }) => parseInt(value, 10))
  @IsNumber()
  @IsNotEmpty()
  requirementId!: number;

  @IsEnum(['document'])
  type!: 'document';

  value!: Express.Multer.File;
}

export class RequirementPayloadDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object, {
    discriminator: {
      property: 'type',
      subTypes: [
        { value: RequirementTextDto, name: 'text' },
        { value: RequirementDocumentDto, name: 'document' },
      ],
    },
    keepDiscriminatorProperty: true,
  })
  payloads!: (RequirementTextDto | RequirementDocumentDto)[];
}

// export class RequirementPayloadDto {
//   @Transform(({ value }) => parseInt(value, 10))
//   @IsNumber()
//   @IsNotEmpty()
//   requirementId!: number;

//   @IsEnum(['text', 'image', 'document'])
//   type!: 'text' | 'image' | 'document';

//   // If type is text, value must be text, or else, value must be an int, indicating an index number
//   value!: string | number;
// }

// // Custom conditional validator
// function IsValidValueBasedOnType(validationOptions?: ValidationOptions) {
//   return function (object: object, propertyName: string) {
//     registerDecorator({
//       name: 'isValidValueBasedOnType',
//       target: object.constructor,
//       propertyName,
//       options: validationOptions,
//       validator: {
//         validate(value: any, args: ValidationArguments) {
//           const obj = args.object as any;
//           if (obj.type === 'text') {
//             return typeof value === 'string';
//           } else if (obj.type === 'image' || obj.type === 'document') {
//             return typeof value === 'number' && Number.isInteger(value);
//           }
//           return false;
//         },
//         defaultMessage(args: ValidationArguments) {
//           const obj = args.object as any;
//           if (obj.type === 'text') {
//             return `'value' must be a string when type is 'text'`;
//           } else {
//             return `'value' must be an integer when type is '${obj.type}'`;
//           }
//         },
//       },
//     });
//   };
// }

// export class PayloadDto {
//   @Transform(({ value }: { value: string }) => parseInt(value, 10))
//   @IsNumber()
//   @IsNotEmpty()
//   requirementId!: number;

//   @IsEnum(['text', 'image', 'document'], {
//     message: "type must be one of: 'text', 'image', 'document'",
//   })
//   type!: 'text' | 'image' | 'document';

//   // Transform string into int if it's strictly an integer, else leave as-is
//   @Transform(({ value }: { value: string }) => {
//     const parsed = parseInt(value, 10);
//     return Number.isNaN(parsed) || parsed.toString() !== value ? value : parsed;
//   })
//   @IsValidValueBasedOnType()
//   value!: string | number;
// }

// export class RequirementPayloadDto {
//   @IsArray()
//   @ValidateNested({ each: true })
//   @Type(() => PayloadDto)
//   payloads!: PayloadDto[];
// }
