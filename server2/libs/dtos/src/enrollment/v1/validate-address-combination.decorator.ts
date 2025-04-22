import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { CreateUserDto } from './create-account.dto';

export function IsValidAddressCombination(
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsValidAddressCombination',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(_: any, args: ValidationArguments): boolean {
          const o = args.object as CreateUserDto;

          // Full names only
          if (
            o.street &&
            o.district &&
            o.municipality &&
            o.province &&
            !o.streetId &&
            !o.districtId &&
            !o.municipalityId &&
            !o.provinceId
          )
            return true;

          // Province ID + names
          if (
            o.provinceId &&
            o.municipality &&
            o.district &&
            o.street &&
            !o.streetId &&
            !o.districtId &&
            !o.municipalityId &&
            !o.province
          )
            return true;

          // Province ID + Municipality ID + names
          if (
            // o.provinceId && // ? I commented this because in municipality id, province is already determined there
            o.municipalityId &&
            o.district &&
            o.street &&
            !o.streetId &&
            !o.districtId &&
            !o.municipality &&
            !o.province &&
            !o.provinceId // ? Since i commented it, it must be unavailable
          )
            return true;

          // Province ID + Municipality ID + District ID + name
          if (
            // o.provinceId && //? Same logic here, data here is predetermined in the ditrict
            // o.municipalityId &&
            o.districtId &&
            o.street &&
            !o.streetId &&
            !o.district &&
            !o.municipality &&
            !o.province &&
            !o.provinceId && // ? I included them since they must be ommitted
            !o.municipalityId
          )
            return true;

          // All IDs only
          if (
            // o.provinceId && // ? Same logic here
            // o.municipalityId &&
            // o.districtId &&
            o.streetId &&
            !o.street &&
            !o.district &&
            !o.municipality &&
            !o.province &&
            !o.provinceId && // Same logic here
            !o.municipalityId &&
            !o.districtId
          )
            return true;

          return false;
        },

        defaultMessage(): string {
          return 'Invalid address combination. Provide either full names or IDs in logical order.';
        },
      },
    });
  };
}
