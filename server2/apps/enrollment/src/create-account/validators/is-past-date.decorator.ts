import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsPastDate(
  strictTime: boolean = false,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsPastDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string | number | Date) {
          const date = new Date(value);
          const currentDate = new Date();

          // If strictTime is true, compare to the current date-time.
          if (strictTime) {
            // The date must be strictly before the current date-time
            return date < currentDate;
          } else {
            // If strictTime is false, just compare to the start of today
            currentDate.setHours(0, 0, 0, 0); // Set time to 00:00:00
            return date < currentDate;
          }
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a date in the past, not today or in the future${strictTime ? ' (strict time mode enabled)' : ''}`;
        },
      },
    });
  };
}
