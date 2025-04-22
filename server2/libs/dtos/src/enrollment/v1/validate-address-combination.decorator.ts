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

          /**
           * ✅ Case 1: Street ID only — most specific.
           * All other fields must be omitted, as everything is inferred from the street.
           * This is likely common when using full lookup selections (e.g., dropdowns).
           */
          if (
            o.streetId &&
            !o.street &&
            !o.district &&
            !o.municipality &&
            !o.province &&
            !o.provinceId &&
            !o.municipalityId &&
            !o.districtId
          ) {
            return true;
          }

          /**
           * ✅ Case 2: District ID + street name.
           * Used when districts are selected but streets are typed.
           */
          if (
            o.districtId &&
            o.street &&
            !o.streetId &&
            !o.district &&
            !o.municipality &&
            !o.province &&
            !o.provinceId &&
            !o.municipalityId
          ) {
            return true;
          }

          /**
           * ✅ Case 3: Municipality ID + district/street names.
           * Province is inferred from municipality.
           */
          if (
            o.municipalityId &&
            o.district &&
            o.street &&
            !o.streetId &&
            !o.districtId &&
            !o.municipality &&
            !o.province &&
            !o.provinceId
          ) {
            return true;
          }

          /**
           * ✅ Case 4: Province ID + all other names.
           * Municipality, district, street are manually typed, but province is selected.
           */
          if (
            o.provinceId &&
            o.municipality &&
            o.district &&
            o.street &&
            !o.streetId &&
            !o.districtId &&
            !o.municipalityId &&
            !o.province
          ) {
            return true;
          }

          /**
           * ✅ Case 5: All full address components as names only.
           * Likely the fallback/manual input path.
           */
          if (
            o.street &&
            o.district &&
            o.municipality &&
            o.province &&
            !o.streetId &&
            !o.districtId &&
            !o.municipalityId &&
            !o.provinceId
          ) {
            return true;
          }

          // ❌ No valid combination matched
          return false;
        },
        defaultMessage(): string {
          return 'Invalid address combination. Provide either full names or IDs in logical order.';
        },
      },
    });
  };
}
