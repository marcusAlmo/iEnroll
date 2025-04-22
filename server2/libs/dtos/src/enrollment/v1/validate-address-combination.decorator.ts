import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

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
          const o = args.object as any;

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
            o.provinceId &&
            o.municipalityId &&
            o.district &&
            o.street &&
            !o.streetId &&
            !o.districtId &&
            !o.municipality &&
            !o.province
          )
            return true;

          // Province ID + Municipality ID + District ID + name
          if (
            o.provinceId &&
            o.municipalityId &&
            o.districtId &&
            o.street &&
            !o.streetId &&
            !o.district &&
            !o.municipality &&
            !o.province
          )
            return true;

          // All IDs only
          if (
            o.provinceId &&
            o.municipalityId &&
            o.districtId &&
            o.streetId &&
            !o.street &&
            !o.district &&
            !o.municipality &&
            !o.province
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
