import { ExistsInPaymentOptionConstraint } from '@lib/validators/enrollment/enrollment.validator';
import { ValidationOptions, registerDecorator } from 'class-validator';

export function ExistsPaymentOption(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'ExistsPaymentOption',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: ExistsInPaymentOptionConstraint,
    });
  };
}
